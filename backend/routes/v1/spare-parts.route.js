import express from 'express'
import { sparePartsController } from '../../controllers/spare-parts.controller.js'
import { validate } from '../../middlewares/validation.middleware.js';
import sparePartsValidator from '../../validators/spare-parts.validator.js';
import { authorize, verifyToken } from '../../middlewares/auth.middleware.js';
import { paramsIdValidator } from '../../validators/id.validator.js';
import { uploadSingle } from '../../middlewares/upload.midleware.js';


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
    uploadSingle("image", "spare-parts"),
    sparePartsValidator,
    validate,
    sparePartsController.create
)

router.put("/:id",
    verifyToken,
    authorize(["ADMIN", "TECHNICAL_EMPLOYEE"]),
    uploadSingle("image", "spare-parts"),
    paramsIdValidator(),
    sparePartsValidator,
    validate,
    sparePartsController.update
)

export default router;