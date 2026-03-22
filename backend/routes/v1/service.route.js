import express from 'express'
import serviceController from "../../controllers/service.controller.js"
import { validate } from '../../middlewares/validation.middleware.js'
import { authorize, verifyToken } from '../../middlewares/auth.middleware.js'
import serviceValidator from '../../validators/service.validator.js'
import { paramsIdValidator } from '../../validators/id.validator.js'


const router = express.Router();

router.get("/",
    serviceController.getAll
);

router.get("/:id",
    paramsIdValidator(),
    validate,
    serviceController.getById
);

router.post("/",
    verifyToken,
    authorize(["ADMIN"]),
    serviceValidator,
    validate,
    serviceController.create
);

router.put("/:id",
    verifyToken,
    authorize(["ADMIN"]),
    paramsIdValidator(),
    serviceValidator,
    validate,
    serviceController.update
);

router.delete("/:id",
    verifyToken,
    authorize(["ADMIN"]),
    paramsIdValidator(),
    validate,
    serviceController.delete
);

export default router;