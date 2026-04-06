import express from "express"
import { sparePartsWarrantyController } from "../../controllers/spare-parts-warranty.controller.js"
import { paramsIdValidator } from "../../validators/id.validator.js"
import { validate } from "../../middlewares/validation.middleware.js"
import { authorize, verifyToken } from "../../middlewares/auth.middleware.js"
import sparePartsWarrantyValidator from "../../validators/spare-parts-warranty.validator.js"
import { response } from "../../utils/response.js"


const router = express.Router();

router.get("/:usage_id",
    paramsIdValidator("usage_id"),
    validate,
    async (req, res, next) => {
        try {
            const { usage_id } = req.params;
            const { SparePartsUsage, SpareParts } = await import("../../schemas/index.js");
            
            const warranty = await sparePartsWarrantyController.getOne({ usage_id });
            
            if (warranty) {
                const warrantyData = warranty.toJSON();
                
                try {
                    // Fetch related data separately
                    if (warrantyData.usage_id) {
                        const usage = await SparePartsUsage.findOne({
                            where: { id: warrantyData.usage_id },
                            attributes: ["id", "quantity", "usage_date", "spare_parts_id"]
                        });
                        
                        if (usage && usage.spare_parts_id) {
                            const sparePart = await SpareParts.findOne({
                                where: { id: usage.spare_parts_id },
                                attributes: ["id", "name", "code", "price", "quantity_in_stock"]
                            });
                            usage.spare_part = sparePart;
                        }
                        
                        warrantyData.spare_parts_usage = usage;
                    }
                } catch (err) {
                    console.error("Error enriching spare parts warranty:", err.message);
                }
                
                return response(res, true, "Spare parts warranty found", 200, warrantyData);
            }
            
            return response(res, true, "Spare parts warranty found", 200, warranty);
        } catch (error) {
            next(error);
        }
    }
);

router.post("/:usage_id",
    verifyToken,
    authorize(["ADMIN", "EMPLOYEE"]),
    paramsIdValidator("usage_id"),
    sparePartsWarrantyValidator,
    validate,
    async (req, res, next) => {
        try {
            const { usage_id } = req.params;
            const warranty = await sparePartsWarrantyController.create(
                { usage_id },
                req.body
            );
            return response(res, true, "Create spare parts warranty successfully", 201, warranty);
        } catch (error) {
            next(error);
        }
    }
);

router.put("/:usage_id",
    verifyToken,
    authorize(["ADMIN", "EMPLOYEE"]),
    paramsIdValidator("usage_id"),
    sparePartsWarrantyValidator,
    validate,
    async (req, res, next) => {
        try {
            const { usage_id } = req.params;
            const warranty = await sparePartsWarrantyController.update(
                { usage_id },
                req.body
            );
            return response(res, true, "Update spare parts warranty successfully", 200, warranty);
        } catch (error) {
            next(error);
        }
    }
);

router.delete("/:usage_id",
    verifyToken,
    authorize(["ADMIN"]),
    paramsIdValidator("usage_id"),
    validate,
    async (req, res, next) => {
        try {
            const { usage_id } = req.params;
            await sparePartsWarrantyController.delete({ usage_id });
            return response(res, true, "Spare parts warranty deleted", 200);
        } catch (error) {
            next(error);
        }
    }
);

export default router;
