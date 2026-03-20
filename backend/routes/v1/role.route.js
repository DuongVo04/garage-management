import express from 'express'
import { roleController } from "../../controllers/role.controller.js";
import { validate } from '../../middlewares/validation.middleware.js'
import { verifyToken, authorize } from "../../middlewares/auth.middleware.js"
import roleValidator from '../../validators/role.validator.js'
import { paramsIdValidator } from '../../validators/id.validator.js'


const router = express.Router()

router.get("/",
    verifyToken,
    authorize(["ADMIN"]),
    roleController.getAll
);

router.get("/:id",
    verifyToken,
    authorize(["ADMIN"]),
    paramsIdValidator(),
    validate,
    roleController.getById
);

router.post("/",
    verifyToken,
    authorize(["ADMIN"]),
    roleValidator,
    validate,
    roleController.create
);

router.put("/:id",
    verifyToken,
    authorize(["ADMIN"]),
    paramsIdValidator(),
    roleValidator,
    validate,
    roleController.update
);

router.delete("/:id",
    verifyToken,
    authorize(["ADMIN"]),
    paramsIdValidator(),
    roleController.delete
);

export default router