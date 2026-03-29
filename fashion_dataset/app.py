import streamlit as st
import tensorflow as tf
import numpy as np
import pickle
from PIL import Image
from tensorflow.keras.models import load_model, Model

# Config
MODEL_PATH = "d:/fashion_dataset/fashion_model.h5"
ENCODER_PATH = "d:/fashion_dataset/encoders.pkl"
IMG_SIZE = (224, 224)

st.set_page_config(page_title="Fashion Freak Scorer", page_icon="👗")

@st.cache_resource
def load_resources():
    try:
        model = load_model(MODEL_PATH, compile=False)
        with open(ENCODER_PATH, "rb") as f:
            encoders = pickle.load(f)
        return model, encoders
    except Exception as e:
        st.error(f"Error loading model/encoders: {e}")
        return None, None

model, encoders = load_resources()

st.title("✨ Fahsion Freak AI Scorer")
st.write("Upload an outfit to get an aesthetic score predicted by AI!")

# Inputs
col1, col2 = st.columns(2)

with col1:
    gender = st.selectbox("Gender", ["Men", "Women"])

with col2:
    # Hardcoded list based on training data knowledge or extracted dynamically if needed
    occasions = ["Casual", "Formal", "Gym", "Prom", "Wedding"]
    occasion = st.selectbox("Occasion", occasions)

uploaded_file = st.file_uploader("Choose an image...", type=["jpg", "jpeg", "png"])

if uploaded_file is not None:
    image = Image.open(uploaded_file)
    st.image(image, caption='Uploaded Outfit', use_column_width=True)
    
    if st.button("Rate My Outfit"):
        if model is None or encoders is None:
            st.error("Model not loaded. Please train the model first.")
        else:
            with st.spinner('Analyzing style...'):
                # 1. Preprocess Image
                img = image.resize(IMG_SIZE)
                img_array = tf.keras.preprocessing.image.img_to_array(img)
                img_array = tf.keras.applications.mobilenet_v2.preprocess_input(img_array)
                img_array = np.expand_dims(img_array, axis=0) # Batch dim
                
                # 2. Preprocess Metadata
                gender_encoder = encoders["gender"]
                occasion_encoder = encoders["occasion"]
                
                # Handle unseen labels gracefully if possible, or just try/except
                try:
                    g_enc = gender_encoder.transform([[gender]])
                    o_enc = occasion_encoder.transform([[occasion]])
                    meta_features = np.hstack([g_enc, o_enc])
                    
                    # 3. Predict
                    prediction = model.predict([img_array, meta_features])
                    score = float(prediction[0][0])
                    score = max(0.0, min(10.0, score)) # Clamp
                    
                    # 4. Display
                    st.success(f"**Predicted Score: {score:.2f} / 10.0**")
                    st.progress(score / 10.0)
                    
                    if score > 8.5:
                        st.balloons()
                        st.markdown("### 🌟 Absolute Stunner!")
                    elif score > 7.0:
                        st.markdown("### 🔥 Looking Good!")
                    else:
                        st.markdown("### 👌 Decent fit!")
                        
                except Exception as e:
                    st.error(f"Error during inference: {e}")
                    
else:
    st.info("Please upload an image to begin.")
