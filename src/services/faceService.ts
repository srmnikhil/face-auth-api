import path from "path";
import * as faceapi from "face-api.js";
import * as canvas from "canvas";

type MatchResult = "Face Verified" | "Face not Verified";

interface FaceCompareResult {
  result: MatchResult;
  threshold: number;
  distances: { pair: string; distance: number; match: boolean }[];
  failedImages?: number[];
  message?: string;
}

const { Canvas, Image, ImageData, loadImage } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

const MODEL_PATH = path.join(__dirname, "..", "..", "models");
let modelsLoaded = false;
export async function loadModels() {
  if (modelsLoaded) return;

  try {
    console.log("Loading face-api.js models from:", MODEL_PATH);
    await faceapi.nets.ssdMobilenetv1.loadFromDisk(MODEL_PATH);
    await faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_PATH);
    await faceapi.nets.faceRecognitionNet.loadFromDisk(MODEL_PATH);
    modelsLoaded = true;
    console.log("Models loaded successfully");
  } catch (err) {
    console.error(
      "Failed to load models. Please check MODEL_PATH and model files:",
      MODEL_PATH
    );
    console.error(err);
    throw new Error("Face-api.js models could not be loaded");
  }
}

export async function compareFaces(
  files: Express.Multer.File[]
): Promise<FaceCompareResult> {
  if (!modelsLoaded) {
    throw new Error("Models not loaded. Call loadModels() first");
  }
  const descriptors: Float32Array[] = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (!file) continue;
    function bufferToImage(buffer: Buffer) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = buffer;
      });
    }
    const image = await bufferToImage(file.buffer);
    const detections = await faceapi
      .detectSingleFace(image)
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detections) {
      if (i === 0) {
        throw new Error("Face not detected in selfie");
      } else {
        throw new Error(`Face not detected in image(s): ${i}`);
      }
    }
    descriptors.push(detections.descriptor);
  }

  const selfieDescriptor = descriptors[0];
  const threshold = 0.55;

  const distances: { pair: string; distance: number; match: boolean }[] = [];
  const failedImages: number[] = [];

  for (let i = 1; i < descriptors.length; i++) {
    // need to check this later
    const dist = faceapi.euclideanDistance(selfieDescriptor!, descriptors[i]!);
    const match = dist < threshold;
    distances.push({
      pair: `Selfie - Image ${i}`,
      distance: +dist.toFixed(4),
      match,
    });
    if (!match) {
      failedImages.push(i);
    }
  }

  if (failedImages.length > 0) {
    return {
      result: "Face not Verified",
      message: `Selfie did not match with image(s): ${failedImages.join(", ")}`,
      failedImages,
      threshold,
      distances,
    };
  }

  return {
    result: "Face Verified",
    threshold: threshold,
    distances: distances,
  };
}
