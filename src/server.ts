require ("@tensorflow/tfjs-node");

import app from "./app";
import { loadModels } from "./services/faceService";

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    console.log("Loading face-api.js models...");
    await loadModels();
    console.log("Models loaded. Starting server...");

    app.listen(PORT, () => {
      console.log(`Server running on PORT:${PORT}`);
    });

  } catch (err) {
    console.error("Error Starting server:", err);
    process.exit(1);
  }
})();
