import express from 'express'
import {
    createRole,
    getAllRoles,
    getById,
    updateRole,
    deleteRole
} from '../../controllers/role.controller.js'
import { validate } from '../../middlewares/validation.middleware.js'
import { verifyToken, authorize } from "../../middlewares/auth.middleware.js"
import roleValidator from '../../validators/role.validator.js'
import { paramsIdValidator } from '../../validators/id.validator.js'


const router = express.Router()

router.get("/",
    verifyToken,
    authorize(["ADMIN"]),
    getAllRoles
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
    roleValidator,
    validate,
    createRole
);

router.put("/:id",
    verifyToken,
    authorize(["ADMIN"]),
    paramsIdValidator(),
    roleValidator,
    validate,
    updateRole
);

router.delete("/:id",
    verifyToken,
    authorize(["ADMIN"]),
    paramsIdValidator(),
    deleteRole
);

export default router