import express from 'express'
import { updateUserAccountStatus, exportTotalCost } from '../../controllers/admin.controller.js'
import { paramsIdValidator } from '../../validators/id.validator.js'
import { validate } from '../../middlewares/validation.middleware.js'
import { authorize, verifyToken } from '../../middlewares/auth.middleware.js';
import { response } from '../../utils/response.js';


const router = express.Router();

router.patch("/accounts/:id/change-status",
    verifyToken,
    authorize(["ADMIN"]),
    paramsIdValidator(),
    validate,
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const message = await updateUserAccountStatus(id, req.body);
            return response(res, true, message, 200);
        } catch (error) {
            next(error);
        }
    }
);

router.get("/revenue/total-cost",
    verifyToken,
    authorize(["ADMIN"]),
    async (req, res, next) => {
        try {
            const revenueData = await exportTotalCost();
            return response(res, true, "Total revenue calculated successfully", 200, revenueData);
        } catch (error) {
            next(error);
        }
    }
);

export default router;