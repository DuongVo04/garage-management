import { ShowroomVehicleImage } from "../schemas/index.js"
import ApiError from "../utils/ApiError.js"
import fs from "fs";
import path from "path";


const ShowroomVehicleImageController = {

    createImages: async (showroom_vehicle_id, uploadedFiles) => {
        if (!uploadedFiles || uploadedFiles.length === 0) {
            throw new ApiError(400, "No images uploaded");
        }

        const records = uploadedFiles.map(file => ({
            image_path: file.path,
            showroom_vehicle_id
        }));

        const result = await ShowroomVehicleImage.bulkCreate(records);

        return result;
    },

    deleteImage: async (id) => {
        const image = await ShowroomVehicleImage.findByPk(id);

        if (!image) {
            throw new ApiError(404, "Image not found");
        }

        const filePath = path.join(process.cwd(), image.image_path);
        try {
            await fs.promises.unlink(filePath);
        } catch (err) {
            console.warn("File delete failed:", err.message);
        }

        await image.destroy();

        return true;
    }
};

export default ShowroomVehicleImageController; 
