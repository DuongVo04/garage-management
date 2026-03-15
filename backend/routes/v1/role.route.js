import express from 'express'
import {
    createRole,
    getAllRoles,
    getById,
    updateRole,
    deleteRole
} from '../../controllers/role.controllers.js'
import { validate } from '../../middlewares/validation.middleware.js';
import roleValidator from '../../validators/role.validator.js';
import { paramsIdValidator } from '../../validators/id.validator.js';


const router = express.Router()

router.get("/", getAllRoles);
router.get("/:id", paramsIdValidator, validate, getById);
router.post("/", roleValidator, validate, createRole);
router.put("/:id", paramsIdValidator, roleValidator, validate, updateRole);
router.delete("/:id", paramsIdValidator, deleteRole);

export default router