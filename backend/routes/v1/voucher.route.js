import express from 'express'
import { voucherController } from '../../controllers/voucher.controller.js'
import { validate } from '../../middlewares/validation.middleware.js'
import { paramsIdValidator } from '../../validators/id.validator.js'
import { authorize, verifyToken } from '../../middlewares/auth.middleware.js';
import voucherValidator from '../../validators/voucher.validator.js';


const router = express.Router();

router.get("/",
    voucherController.getAll
);

router.get("/:id",
    paramsIdValidator(),
    validate,
    voucherController.getById
);

router.post("/",
    verifyToken,
    authorize(["ADMIN"]),
    voucherValidator,
    validate,
    voucherController.create
);

router.put("/:id",
    verifyToken,
    authorize(["ADMIN"]),
    voucherValidator,
    paramsIdValidator(),
    validate,
    voucherController.update
)

router.delete("/:id",
    verifyToken,
    authorize(["ADMIN"]),
    paramsIdValidator(),
    validate,
    voucherController.delete
)

export default router;