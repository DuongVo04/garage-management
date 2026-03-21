import express from 'express'
import { sparePartsController } from '../../controllers/spare-parts.controller.js'
import { validate } from '../../middlewares/validation.middleware.js';
import sparePartsValidator from '../../validators/spare-parts.validator.js';
import { authorize, verifyToken } from '../../middlewares/auth.middleware.js';
import { paramsIdValidator } from '../../validators/id.validator.js';


const router = express.Router();

router.get("/",
    sparePartsController.getAll
)

router.get("/:id",
    paramsIdValidator(),
    validate,
    sparePartsController.getAll
)

router.post("/",
    verifyToken,
    authorize(["ADMIN", "TECHNICAL_EMPLOYEE"]),
    sparePartsValidator,
    validate,
    sparePartsController.create
)

router.put("/:id",
    verifyToken,
    authorize(["ADMIN", "TECHNICAL_EMPLOYEE"]),
    paramsIdValidator(),
    sparePartsValidator,
    validate,
    sparePartsController.update
)

export default router;