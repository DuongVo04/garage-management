import { ShowroomVehicleImage } from "../schemas/index.js"
import { response } from "../utils/response.js";
import fs from "fs";
import path from "path";


const ShowroomVehicleImageController = {

    createImages: async (req, res, next) => {
        try {
            const { showroom_vehicle_id } = req.params;

            if (!req.uploadedFiles || req.uploadedFiles.length === 0) {
                return response(res, false, "No images uploaded", 400);
            }

            const records = req.uploadedFiles.map(file => ({
                image_path: file.path,
                showroom_vehicle_id
            }));

            const result = await ShowroomVehicleImage.bulkCreate(records);

            return response(res, true, "Upload success", 200, result);

        } catch (err) {
            next(err);
        }
    },

    deleteImage: async (req, res, next) => {
        try {
            const { id } = req.params;

            const image = await ShowroomVehicleImage.findByPk(id);

            if (!image) {
                return response(res, false, "Image not found", 404);
            }

            const filePath = path.join(process.cwd(), image.image_path);
            try {
                await fs.promises.unlink(filePath);
            } catch (err) {
                console.warn("File delete failed:", err.message);
            }

            await image.destroy();

            return response(res, true, "Deleted permanently", 200);

        } catch (err) {
            next(err);
        }
    }
};

export default ShowroomVehicleImageController; 