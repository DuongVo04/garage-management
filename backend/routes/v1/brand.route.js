import express from "express"
import { brandController } from "../../controllers/brand.controller.js"
import { paramsIdValidator } from "../../validators/id.validator.js"
import { validate } from "../../middlewares/validation.middleware.js"
import { authorize, verifyToken } from "../../middlewares/auth.middleware.js"
import brandValidator from "../../validators/brand.validator.js"
import { uploadSingle } from "../../middlewares/upload.midleware.js"
import { response } from "../../utils/response.js"


const router = express.Router();

router.get("/",
    async (req, res, next) => {
        try {
            const brands = await brandController.getAll();
            return response(res, true, "Get brands successfully", 200, brands);
        } catch (error) {
            next(error);
        }
    }
);

router.get("/:id",
    paramsIdValidator(),
    validate,
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const brand = await brandController.getById(id);
            return response(res, true, "Brand found", 200, brand);
        } catch (error) {
            next(error);
        }
    }
);

router.post("/",
    verifyToken,
    authorize(["ADMIN"]),
    uploadSingle("logo_url", "brand"),
    brandValidator,
    validate,
    async (req, res, next) => {
        try {
            const brand = await brandController.create(req.body, req.uploadedFile);
            return response(res, true, "Create brand successfully", 201, brand);
        } catch (error) {
            next(error);
        }
    }
);

router.put("/:id",
    verifyToken,
    authorize(["ADMIN"]),
    uploadSingle("logo_url", "brand"),
    paramsIdValidator(),
    brandValidator,
    validate,
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const brand = await brandController.update(id, req.body, req.uploadedFile);
            return response(res, true, "Update brand successfully", 200, brand);
        } catch (error) {
            next(error);
        }
    }
)

router.delete("/:id",
    verifyToken,
    authorize(["ADMIN"]),
    paramsIdValidator(),
    validate,
    async (req, res, next) => {
        try {
            const { id } = req.params;
            await brandController.delete(id);
            return response(res, true, "Brand deleted", 200);
        } catch (error) {
            next(error);
        }
    }
)

export default router;