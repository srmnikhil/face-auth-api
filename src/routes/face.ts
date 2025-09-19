import { Router, Request, Response } from "express";
import multer from "multer";
import { compareFaces, loadModels } from "../services/faceService";

export default (upload: multer.Multer) => {
  const router = Router();
  router.post(
    "/",
    upload.fields([
      { name: "selfie", maxCount: 1 },
      { name: "images", maxCount: 4 },
    ]),
    async (req: Request, res: Response) => {
      try {
        const files = req.files as {
          [fieldname: string]: Express.Multer.File[];
        };
        const selfie = files?.["selfie"]?.[0];
        const images = files?.["images"] || [];

        if (!selfie || images.length !== 4) {
          return res
            .status(400)
            .json({ error: "Upload 1 selfie and 4 images" });
        }

        await loadModels();
        const result = await compareFaces([selfie, ...images]);
        return res.json(result);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error(err.message);
          return res.status(500).json({ error: err.message || "Server Error" });
        }
        return res.status(500).json({ error: "Unknown error" });
      }
    }
  );

  return router;
};
