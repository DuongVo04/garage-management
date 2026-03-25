import express from 'express'
import { authorize, verifyToken } from '../../middlewares/auth.middleware.js';
import { bodyIdValidator, paramsIdValidator } from '../../validators/id.validator.js';
import ShowroomVehicleImageController from '../../controllers/showroom-vehicle-image.controller.js';
import { uploadMultiple } from '../../middlewares/upload.midleware.js';
import { validate } from '../../middlewares/validation.middleware.js';


const router = express.Router();

router.post("/:showroom_vehicle_id/images",
    verifyToken,
    authorize(["ADMIN"]),
    uploadMultiple("images", 10, "showroom-vehicle-images"),
    paramsIdValidator("showroom_vehicle_id"),
    validate,
    ShowroomVehicleImageController.createImages
);

router.delete("/:showroom_vehicle_id/images/:id",
    verifyToken,
    authorize(["ADMIN"]),
    uploadMultiple("images", 10, "showroom-vehicle-images"),
    paramsIdValidator("showroom_vehicle_id"),
    paramsIdValidator("id"),
    validate,
    ShowroomVehicleImageController.deleteImage
)

export default router;