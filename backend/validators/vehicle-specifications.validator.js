import { body } from "express-validator";
import { bodyIdValidator } from "./id.validator.js";


export const steeringSystemValidator = [
    body("transmission")
        .exists().withMessage("transmission is required")
        .isString().withMessage("transmission must be a string")
        .isLength({ max: 100 }),
    body("drivetrain")
        .exists().withMessage("drivetrain is required")
        .isString().withMessage("drivetrain must be a string")
        .isLength({ max: 100 }),
    // bodyIdValidator("showroom_vehicle_id")

];

export const vehicleSizeValidator = [
    body("length_mm").exists().withMessage("length_mm is required").isInt({ min: 0 }),
    body("width_mm").exists().withMessage("width_mm is required").isInt({ min: 0 }),
    body("height_mm").exists().withMessage("height_mm is required").isInt({ min: 0 }),
    body("wheelbase_mm").exists().withMessage("wheelbase_mm is required").isInt({ min: 0 }),
    // bodyIdValidator("showroom_vehicle_id")
];

export const fuelValidator = [
    body("fuel_type")
        .exists().withMessage("fuel_type is required")
        .isString().isLength({ max: 100 }),
    body("fuel_consumption")
        .optional()
        .isString().isLength({ max: 50 }),
    body("fuel_tank_capacity")
        .optional()
        .isString().isLength({ max: 50 }),
    // bodyIdValidator("showroom_vehicle_id")
];

export const engineTechnicalValidator = [
    body("engine_type")
        .exists().withMessage("engine_type is required")
        .isString().isLength({ max: 100 }),
    body("engine_capacity")
        .optional()
        .isFloat({ min: 0 }).withMessage("engine_capacity must be a positive number"),
    body("max_power")
        .notEmpty().withMessage("max_power is required")
        .bail()
        .isInt({ min: 0 }).withMessage("max_power must be a positive integer"),
    body("max_torque")
        .optional({ nullable: true })
        .isInt({ min: 0 }).withMessage("max_torque must be a positive integer"),
    // bodyIdValidator("showroom_vehicle_id")
];


export const interiorValidator = [
    body("seat_count")
        .exists().withMessage("seat_count is required")
        .isInt({ min: 0 }),
    body("is_androidauto_applecarplay")
        .exists().withMessage("is_androidauto_applecarplay is required")
        .isBoolean(),
    // bodyIdValidator("showroom_vehicle_id")
];