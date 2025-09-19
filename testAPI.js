const fs = require("fs");
const path = require("path");
const axios = require("axios");
const FormData = require("form-data");

const API_URL = "http://localhost:5000/verify-faces"; // change if your server is on different port
const DATASET_DIR = path.join(__dirname, "dataset"); // your dataset folder

async function testDataset() {
  let selfieIndex = 1;

  while (true) {
    const selfiePath = path.join(DATASET_DIR, `selfie${selfieIndex}.png`);
    if (!fs.existsSync(selfiePath)) {
      console.log(`No more selfies found. Stopping at selfie${selfieIndex}`);
      break;
    }

    const selfieBuffer = fs.readFileSync(selfiePath);

    // Load associated images
    const images = [];
    for (let i = 1; i <= 4; i++) {
      const imgPath = path.join(DATASET_DIR, `img${selfieIndex}-${i}.png`);
      if (fs.existsSync(imgPath)) {
        images.push({ buffer: fs.readFileSync(imgPath), name: `img${i}.png` });
      }
    }

    if (images.length === 0) {
      console.log(`No associated images found for selfie${selfieIndex}, skipping...`);
      selfieIndex++;
      continue;
    }

    // Prepare form-data
    const form = new FormData();
    form.append("selfie", selfieBuffer, `selfie${selfieIndex}.png`);
    images.forEach(img => form.append("images", img.buffer, img.name));

    try {
      const res = await axios.post(API_URL, form, {
        headers: form.getHeaders(),
        maxBodyLength: Infinity,
      });
      console.log(`Result for selfie${selfieIndex}:`, res.data);
    } catch (err) {
      if (err.response) {
        console.error(`Error for selfie${selfieIndex}:`, err.response.data);
      } else {
        console.error(`Error for selfie${selfieIndex}:`, err.message);
      }
    }

    selfieIndex++;
  }
}

testDataset();
