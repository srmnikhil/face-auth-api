# Face Verification API

A simple face verification API built with **Node.js**, **TypeScript**, and **face-api.js**.  
It allows uploading selfies and reference images, compares them, and returns whether they match.

---

## 🚀 Features
- Upload **1 selfie + 4 images** for comparison.
- Face detection and recognition using `face-api.js`.
- Accepts multiple formats: **PNG, JPG, JPEG**.
- RESTful API built with Express.js.
- Lightweight and easy to deploy.

---

## 📂 Project Structure
```
├── src
│   ├── app.ts          # Express app setup
│   ├── server.ts       # Entry point
│   ├── routes
│   │   └── face.ts     # Face verification routes
│   └── services
│       └── faceService.ts # Face processing logic
├── models              # Face-api.js pretrained models
└── README.md
```

---

## ⚙️ Installation

```bash
# Clone the repo
git clone https://github.com/srmnikhil/face-auth-api.git

cd face-auth-api

# Install dependencies
npm install

# Run Development Server
npm run dev

# Build TypeScript
npm run build
```

---

## ▶️ Running the Server

### Development Mode (with hot reload)
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

---

## 🔑 API Endpoints

### 1. Verify Faces
**POST** `/verify-faces`

#### Request (multipart/form-data)
- `selfie` → Single selfie image (PNG/JPG/JPEG).
- `images` → 1–4 reference images to match against.

#### Response
### ✅ All images match with selfie
```json
{
  "result": "Face Verified",
  "threshold": 0.55,
  "distances": [
    {
      "pair": "Selfie - Image 1",
      "distance": 0.332,
      "match": true
    },
    {
      "pair": "Selfie - Image 2",
      "distance": 0.401,
      "match": true
    },
    {
      "pair": "Selfie - Image 3",
      "distance": 0.298,
      "match": true
    },
    {
      "pair": "Selfie - Image 4",
      "distance": 0.354,
      "match": true
    }
  ]
}
```

### ❌ One or more images do not match
```json
{
  "result": "Face not Verified",
  "message": "Selfie did not match with image(s): 4",
  "failedImages": [
    4
  ],
  "threshold": 0.55,
  "distances": [
    {
      "pair": "Selfie - Image 1",
      "distance": 0.332,
      "match": true
    },
    {
      "pair": "Selfie - Image 4",
      "distance": 0.6017,
      "match": false
    }
  ]
}

```
### ⚠️ Face not detected
```json
{
    "error": "Face not detected in selfie"
}
```
```json
{
    "error": "Face not detected in image(s): 1"
}
```

---

### 2. Health Check
**GET** `/ping`

Response:
```text
PONG
```

---


## 📦 Deployment

When deploying:
- Deploy only the **dist/** folder and **models/** folder.
- Ensure environment variable `PORT` is set, else defaults to `5000`.

---
