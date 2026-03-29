# Fashion Freak AI Scorer

An AI-powered application that predicts the aesthetic score of an outfit based on visual analysis and metadata.

## Prerequisites
*   Python 3.8 or higher
*   pip package manager

## Installation

1.  **Clone/Navigate** to the project directory:
    ```bash
    cd d:/fashion_dataset
    ```

2.  **Install Dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

## Quick Start

### 1. Run the App
If the model is already trained, simply launch the app:
```bash
python -m streamlit run app.py
```
Open your browser to `http://localhost:8501`.

### 2. Retrain the Model (Optional)
If you want to retrain the model on the dataset:
```bash
python train_model.py
```
This will save a new `fashion_model.h5` and `encoders.pkl` to the directory.

## Project Scripts
*   **`app.py`**: The Streamlit user interface for scoring new images.
*   **`train_model.py`**: Trains the MobileNetV2-based Neural Network.
*   **`generate_dataset_csv.py`**: Generates the CSV dataset from raw images (already executed).
*   **`create_contact_sheets.py`**: Helper to view images in batches (already executed).
*   **`unzip_images.py`**: Helper to extract zip archives (already executed).
