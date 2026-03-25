import express from "express";
import { paramsIdValidator } from "../../validators/id.validator.js";
import { validate } from "../../middlewares/validation.middleware.js";
import { authorize, verifyToken } from "../../middlewares/auth.middleware.js";
import {
    size,
    steering,
    fuel,
    engine,
    interior
} from "../../controllers/vehicle-specifications.controller.js";
import {
    fuelValidator,
    interiorValidator,
    vehicleSizeValidator,
    steeringSystemValidator,
    engineTechnicalValidator,
} from "../../validators/vehicle-specifications.validator.js";


const router = express.Router();

const adminMiddleware = [
    verifyToken,
    authorize(["ADMIN"]),
    paramsIdValidator("showroom_vehicle_id"),
];

const createCrudRoutes = (path, controller, validator) => {
    if (validator) {
        router.post(`/:showroom_vehicle_id/${path}`, ...adminMiddleware, validator, validate, controller.create);
        router.put(`/:showroom_vehicle_id/${path}`, ...adminMiddleware, validator, validate, controller.update);
    } else {
        router.post(`/:showroom_vehicle_id/${path}`, ...adminMiddleware, validate, controller.create);
        router.put(`/:showroom_vehicle_id/${path}`, ...adminMiddleware, validate, controller.update);
    }

    router.delete(`/:showroom_vehicle_id/${path}`, ...adminMiddleware, validate, controller.delete);
}

createCrudRoutes("size", size, vehicleSizeValidator);
createCrudRoutes("steering", steering, steeringSystemValidator);
createCrudRoutes("fuel", fuel, fuelValidator);
createCrudRoutes("engine", engine, engineTechnicalValidator);
createCrudRoutes("interior", interior, interiorValidator);

export default router;