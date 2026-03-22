import express from "express"
import { brandController } from "../../controllers/brand.controller.js"
import { paramsIdValidator } from "../../validators/id.validator.js"
import { validate } from "../../middlewares/validation.middleware.js"
import { authorize, verifyToken } from "../../middlewares/auth.middleware.js"
import brandValidator from "../../validators/brand.validator.js"


const router = express.Router();

router.get("/",
    brandController.getAll
);

router.get("/:id",
    paramsIdValidator(),
    validate,
    brandController.getById
);

router.post("/",
    verifyToken,
    authorize(["ADMIN"]),
    brandValidator,
    validate,
    brandController.create
);

router.put("/:id",
    verifyToken,
    authorize(["ADMIN"]),
    paramsIdValidator(),
    brandValidator,
    validate,
    brandController.update
)

router.delete("/:id",
    verifyToken,
    authorize(["ADMIN"]),
    paramsIdValidator(),
    validate,
    brandController.delete
)

export default router;