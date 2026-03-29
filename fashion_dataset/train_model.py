import os
import pandas as pd
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Input, Dense, GlobalAveragePooling2D, Concatenate, Dropout, BatchNormalization
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.preprocessing.image import load_img, img_to_array
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder, StandardScaler

# Config
IMG_SIZE = (224, 224)
BATCH_SIZE = 32
EPOCHS = 5
CSV_PATH = "d:/fashion_dataset/fashion_dataset.csv"
MODEL_SAVE_PATH = "d:/fashion_dataset/fashion_model.h5"

print("Loading dataset...")
df = pd.read_csv(CSV_PATH)

# Preprocessing Metadata
print("Preprocessing metadata...")
# Gender encoding
gender_encoder = OneHotEncoder(sparse_output=False)
gender_encoded = gender_encoder.fit_transform(df[['gender']])

# Occasion encoding
occasion_encoder = OneHotEncoder(sparse_output=False)
occasion_encoded = occasion_encoder.fit_transform(df[['occasion']])

# Combine metadata features
meta_features = np.hstack([gender_encoded, occasion_encoded])
print(f"Metadata features shape: {meta_features.shape}")

# Preprocessing Images
print("Loading and preprocessing images...")
image_data = []
scores = []
valid_indices = []

for idx, row in df.iterrows():
    try:
        img_path = row['image_path']
        img = load_img(img_path, target_size=IMG_SIZE)
        img_array = img_to_array(img)
        img_array = tf.keras.applications.mobilenet_v2.preprocess_input(img_array)
        
        image_data.append(img_array)
        scores.append(row['score'])
        valid_indices.append(idx)
    except Exception as e:
        print(f"Error loading image {row['image_path']}: {e}")

X_images = np.array(image_data)
X_meta = meta_features[valid_indices]
y = np.array(scores)

print(f"Images shape: {X_images.shape}")
print(f"Meta shape: {X_meta.shape}")
print(f"Targets shape: {y.shape}")

# Split Data
X_img_train, X_img_val, X_meta_train, X_meta_val, y_train, y_val = train_test_split(
    X_images, X_meta, y, test_size=0.2, random_state=42
)

# Build Model
def build_model(meta_input_shape):
    # 1. Image Branch
    image_input = Input(shape=(IMG_SIZE[0], IMG_SIZE[1], 3), name="image_input")
    base_model = MobileNetV2(weights='imagenet', include_top=False, input_tensor=image_input)
    # Freeze base model
    for layer in base_model.layers:
        layer.trainable = False
        
    x = base_model.output
    x = GlobalAveragePooling2D()(x)
    x = Dense(128, activation='relu')(x)
    x = BatchNormalization()(x)
    x = Dropout(0.3)(x)
    
    # 2. Metadata Branch
    meta_input = Input(shape=(meta_input_shape,), name="meta_input")
    y = Dense(32, activation='relu')(meta_input)
    y = BatchNormalization()(y)
    
    # 3. Combine
    combined = Concatenate()([x, y])
    z = Dense(64, activation='relu')(combined)
    z = Dropout(0.2)(z)
    output = Dense(1, activation='linear', name="score_output")(z)
    
    model = Model(inputs=[image_input, meta_input], outputs=output)
    return model

print("Building model...")
model = build_model(X_meta.shape[1])
model.compile(optimizer=tf.keras.optimizers.Adam(learning_rate=0.001), loss='mse', metrics=['mae'])
model.summary()

# Train
print("Starting training...")
history = model.fit(
    [X_img_train, X_meta_train], y_train,
    validation_data=([X_img_val, X_meta_val], y_val),
    epochs=EPOCHS,
    batch_size=BATCH_SIZE
)

# Save
print(f"Saving model to {MODEL_SAVE_PATH}...")
model.save(MODEL_SAVE_PATH)

# Save Encoders (simple pickle for the app)
import pickle
with open("d:/fashion_dataset/encoders.pkl", "wb") as f:
    pickle.dump({"gender": gender_encoder, "occasion": occasion_encoder}, f)
print("Saved encoders.")

print("Training complete.")
