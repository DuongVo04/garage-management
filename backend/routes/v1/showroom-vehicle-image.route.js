import express from 'express'
import { authorize, verifyToken } from '../../middlewares/auth.middleware.js';
import { bodyIdValidator, paramsIdValidator } from '../../validators/id.validator.js';
import ShowroomVehicleImageController from '../../controllers/showroom-vehicle-image.controller.js';
import { uploadMultiple } from '../../middlewares/upload.midleware.js';
import { validate } from '../../middlewares/validation.middleware.js';
import { response } from '../../utils/response.js';


const router = express.Router();

router.post("/:showroom_vehicle_id/images",
    verifyToken,
    authorize(["ADMIN"]),
    uploadMultiple("images", 10, "showroom-vehicle-images"),
    paramsIdValidator("showroom_vehicle_id"),
    validate,
    async (req, res, next) => {
        try {
            const { showroom_vehicle_id } = req.params;
            const result = await ShowroomVehicleImageController.createImages(showroom_vehicle_id, req.uploadedFiles);
            return response(res, true, "Upload success", 200, result);
        } catch (error) {
            next(error);
        }
    }
);

router.delete("/:showroom_vehicle_id/images/:id",
    verifyToken,
    authorize(["ADMIN"]),
    uploadMultiple("images", 10, "showroom-vehicle-images"),
    paramsIdValidator("showroom_vehicle_id"),
    paramsIdValidator("id"),
    validate,
    async (req, res, next) => {
        try {
            const { id } = req.params;
            await ShowroomVehicleImageController.deleteImage(id);
            return response(res, true, "Deleted permanently", 200);
        } catch (error) {
            next(error);
        }
    }
)

export default router;