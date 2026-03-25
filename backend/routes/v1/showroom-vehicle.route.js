import express from "express"
import showroomVehicleController from "../../controllers/showroom-vehicle.controller.js"
import { paramsIdValidator } from "../../validators/id.validator.js";
import { validate } from "../../middlewares/validation.middleware.js";
import showroomVehicleValidator from "../../validators/showroom-vehicle.validator.js";
import { authorize, verifyToken } from "../../middlewares/auth.middleware.js";
import { uploadSingle } from "../../middlewares/upload.midleware.js";


const router = express.Router();

router.get("/",
    showroomVehicleController.getAll
);

router.get("/:id",
    paramsIdValidator(),
    validate,
    showroomVehicleController.getById
);

router.post("/",
    verifyToken,
    authorize(["ADMIN"]),
    uploadSingle("thumbnail", "showroom-vehicles"),
    showroomVehicleValidator,
    validate,
    showroomVehicleController.create
);

router.put("/:id",
    verifyToken,
    authorize(["ADMIN"]),
    uploadSingle("thumbnail", "showroom-vehicles"),
    paramsIdValidator(),
    showroomVehicleValidator,
    validate,
    showroomVehicleController.update
)

router.delete("/:id",
    verifyToken,
    authorize(["ADMIN"]),
    uploadSingle("thumbnail", "showroom-vehicles"),
    paramsIdValidator(),
    validate,
    showroomVehicleController.delete
);

export default router;