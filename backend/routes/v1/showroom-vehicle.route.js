import express from "express"
import showroomVehicleController from "../../controllers/showroom-vehicle.controller.js"
import { paramsIdValidator } from "../../validators/id.validator.js";
import { validate } from "../../middlewares/validation.middleware.js";
import showroomVehicleValidator from "../../validators/showroom-vehicle.validator.js";
import { authorize, verifyToken } from "../../middlewares/auth.middleware.js";
import { uploadSingle } from "../../middlewares/upload.midleware.js";
import { response } from "../../utils/response.js";


const router = express.Router();

router.get("/",
    async (req, res, next) => {
        try {
            const showroomVehicles = await showroomVehicleController.getAll();
            return response(res, true, "Get showroom vehicles successfully", 200, showroomVehicles);
        } catch (error) {
            next(error);
        }
    }
);

router.get("/:id",
    paramsIdValidator(),
    validate,
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const showroomVehicle = await showroomVehicleController.getById(id);
            return response(res, true, "Showroom vehicle found", 200, showroomVehicle);
        } catch (error) {
            next(error);
        }
    }
);

router.post("/",
    verifyToken,
    authorize(["ADMIN"]),
    uploadSingle("thumbnail", "showroom-vehicles"),
    showroomVehicleValidator,
    validate,
    async (req, res, next) => {
        try {
            const showroomVehicle = await showroomVehicleController.create(req.body, req.uploadedFile);
            return response(res, true, "Create showroom vehicle successfully", 201, showroomVehicle);
        } catch (error) {
            next(error);
        }
    }
);

router.put("/:id",
    verifyToken,
    authorize(["ADMIN"]),
    uploadSingle("thumbnail", "showroom-vehicles"),
    paramsIdValidator(),
    showroomVehicleValidator,
    validate,
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const showroomVehicle = await showroomVehicleController.update(id, req.body, req.uploadedFile);
            return response(res, true, "Update showroom vehicle successfully", 200, showroomVehicle);
        } catch (error) {
            next(error);
        }
    }
)

router.delete("/:id",
    verifyToken,
    authorize(["ADMIN"]),
    uploadSingle("thumbnail", "showroom-vehicles"),
    paramsIdValidator(),
    validate,
    async (req, res, next) => {
        try {
            const { id } = req.params;
            await showroomVehicleController.delete(id);
            return response(res, true, "Showroom vehicle deleted", 200);
        } catch (error) {
            next(error);
        }
    }
);

export default router;