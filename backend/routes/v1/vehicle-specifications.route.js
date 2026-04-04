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
import { response } from "../../utils/response.js";


const router = express.Router();

const adminMiddleware = [
    verifyToken,
    authorize(["ADMIN"]),
    paramsIdValidator("showroom_vehicle_id"),
];

const createCrudRoutes = (path, controller, validator) => {
    if (validator) {
        router.post(`/:showroom_vehicle_id/${path}`, ...adminMiddleware, validator, validate, async (req, res, next) => {
            try {
                const data = await controller.create(req.params, req.body);
                return response(res, true, "Created successfully", 201, data);
            } catch (error) {
                next(error);
            }
        });
        router.put(`/:showroom_vehicle_id/${path}`, ...adminMiddleware, validator, validate, async (req, res, next) => {
            try {
                const data = await controller.update(req.params, req.body);
                return response(res, true, "Updated successfully", 200, data);
            } catch (error) {
                next(error);
            }
        });
    } else {
        router.post(`/:showroom_vehicle_id/${path}`, ...adminMiddleware, validate, async (req, res, next) => {
            try {
                const data = await controller.create(req.params, req.body);
                return response(res, true, "Created successfully", 201, data);
            } catch (error) {
                next(error);
            }
        });
        router.put(`/:showroom_vehicle_id/${path}`, ...adminMiddleware, validate, async (req, res, next) => {
            try {
                const data = await controller.update(req.params, req.body);
                return response(res, true, "Updated successfully", 200, data);
            } catch (error) {
                next(error);
            }
        });
    }

    router.delete(`/:showroom_vehicle_id/${path}`, ...adminMiddleware, validate, async (req, res, next) => {
        try {
            await controller.delete(req.params);
            return response(res, true, "Deleted permanently", 200);
        } catch (error) {
            next(error);
        }
    });
}

createCrudRoutes("size", size, vehicleSizeValidator);
createCrudRoutes("steering", steering, steeringSystemValidator);
createCrudRoutes("fuel", fuel, fuelValidator);
createCrudRoutes("engine", engine, engineTechnicalValidator);
createCrudRoutes("interior", interior, interiorValidator);

export default router;