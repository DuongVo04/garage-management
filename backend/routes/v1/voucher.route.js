import express from 'express'
import { voucherController } from '../../controllers/voucher.controller.js'
import { validate } from '../../middlewares/validation.middleware.js'
import { paramsIdValidator } from '../../validators/id.validator.js'
import { authorize, verifyToken } from '../../middlewares/auth.middleware.js';
import voucherValidator from '../../validators/voucher.validator.js';
import { response } from '../../utils/response.js';


const router = express.Router();

router.get("/",
    async (req, res, next) => {
        try {
            const vouchers = await voucherController.getAll(req.query);
            return response(res, true, "Get vouchers successfully", 200, vouchers);
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
            const voucher = await voucherController.getById(id);
            return response(res, true, "Voucher found", 200, voucher);
        } catch (error) {
            next(error);
        }
    }
);

router.post("/",
    verifyToken,
    authorize(["ADMIN"]),
    voucherValidator,
    validate,
    async (req, res, next) => {
        try {
            const voucher = await voucherController.create(req.body);
            return response(res, true, "Create voucher successfully", 201, voucher);
        } catch (error) {
            next(error);
        }
    }
);

router.put("/:id",
    verifyToken,
    authorize(["ADMIN"]),
    voucherValidator,
    paramsIdValidator(),
    validate,
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const voucher = await voucherController.update(id, req.body);
            return response(res, true, "Update voucher successfully", 200, voucher);
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
            await voucherController.delete(id);
            return response(res, true, "Voucher deleted", 200);
        } catch (error) {
            next(error);
        }
    }
)

export default router;