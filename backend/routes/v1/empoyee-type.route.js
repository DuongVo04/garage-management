import express from "express";
import { validate } from "../../middlewares/validation.middleware.js"
import {
    createEmployeeType,
    deletEmployeeType,
    getAllEmployeeType,
    getById,
    updateEmployeeType
} from "../../controllers/empoyee-type.controller.js";
import { authorize, verifyToken } from "../../middlewares/auth.middleware.js";
import { paramsIdValidator } from "../../validators/id.validator.js";
import empoyeeTypeValidator from "../../validators/empoyee-type.validator.js";

const router = express.Router();

router.get("/",
    verifyToken,
    authorize(["ADMIN"]),
    getAllEmployeeType
);

router.get("/:id",
    verifyToken,
    authorize(["ADMIN"]),
    paramsIdValidator(),
    validate,
    getById
);

router.post("/",
    verifyToken,
    authorize(["ADMIN"]),
    validate,
    createEmployeeType
);

router.put("/:id",
    verifyToken,
    authorize(["ADMIN"]),
    paramsIdValidator(),
    empoyeeTypeValidator,
    validate,
    updateEmployeeType
);

router.delete("/:id",
    verifyToken,
    authorize(["ADMIN"]),
    paramsIdValidator(),
    deletEmployeeType
);

export default router;