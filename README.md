# FashionFreak (StyleVote)

FashionFreak is a full-stack web application for uploading and rating fashion outfits using AI and peer reviews.

## Project Structure

- `frontend/`: React + Vite frontend application.
- `backend/`: FastAPI backend for APIs and AI ML models.
- `mobile/`: Mobile application code (if applicable).

## Prerequisites

- Node.js (v18+)
- Python (3.9+)

## Installation & Setup

### 1. Backend Setup
Navigate to the `backend` directory and setup the Python environment:
```bash
cd backend
python -m venv .venv
# Activate the virtual environment
# Windows:
.venv\Scripts\activate
# Linux/Mac:
source .venv/bin/activate

pip install -r requirements.txt
```

Run the backend server:
```bash
python app.py
```
The backend will run on `http://localhost:8000`. API documentation is available at `http://localhost:8000/docs`.

### 2. Frontend Setup
Navigate to the `frontend` directory and install dependencies:
```bash
cd frontend
npm install
```

Start the development server:
```bash
npm run dev
```
The frontend will run on `http://localhost:5173`.
