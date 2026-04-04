import express from 'express'
import { sparePartsController } from '../../controllers/spare-parts.controller.js'
import { validate } from '../../middlewares/validation.middleware.js';
import sparePartsValidator from '../../validators/spare-parts.validator.js';
import { authorize, verifyToken } from '../../middlewares/auth.middleware.js';
import { paramsIdValidator } from '../../validators/id.validator.js';
import { uploadSingle } from '../../middlewares/upload.midleware.js';
import { response } from '../../utils/response.js';


const router = express.Router();

router.get("/",
    async (req, res, next) => {
        try {
            const spareParts = await sparePartsController.getAll();
            return response(res, true, "Get spare parts successfully", 200, spareParts);
        } catch (error) {
            next(error);
        }
    }
)

router.get("/:id",
    paramsIdValidator(),
    validate,
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const sparePart = await sparePartsController.getById(id);
            return response(res, true, "Spare part found", 200, sparePart);
        } catch (error) {
            next(error);
        }
    }
)

router.post("/",
    verifyToken,
    authorize(["ADMIN", "TECHNICAL_EMPLOYEE"]),
    uploadSingle("image_path", "spare-parts"),
    sparePartsValidator,
    validate,
    async (req, res, next) => {
        try {
            const sparePart = await sparePartsController.create(req.body, req.uploadedFile);
            return response(res, true, "Create spare part successfully", 201, sparePart);
        } catch (error) {
            next(error);
        }
    }
)

router.put("/:id",
    verifyToken,
    authorize(["ADMIN", "TECHNICAL_EMPLOYEE"]),
    uploadSingle("image_path", "spare-parts"),
    paramsIdValidator(),
    sparePartsValidator,
    validate,
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const sparePart = await sparePartsController.update(id, req.body, req.uploadedFile);
            return response(res, true, "Update spare part successfully", 200, sparePart);
        } catch (error) {
            next(error);
        }
    }
)

export default router;