import { body } from "express-validator";

const invoiceValidator = [
    body("created_date")
        .optional()
        .isISO8601()
        .withMessage("created_date must be a valid date")
        .bail()
        .custom((value) => {
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (!dateRegex.test(value)) {
                throw new Error("created_date must be in format YYYY-MM-DD");
            }
            return true;
        }),
    
    body("total_cost")
        .optional()
        .isDecimal({ decimal_digits: "0,2" })
        .withMessage("total_cost must be a decimal number")
        .bail()
        .isFloat({ min: 0 })
        .withMessage("total_cost must be greater than or equal to 0"),
    
    body("payment_method")
        .optional()
        .isString()
        .withMessage("payment_method must be a string")
        .bail()
        .isLength({ max: 20 })
        .withMessage("payment_method must not exceed 20 characters")
        .bail()
        .isIn(["CASH", "CREDIT_CARD", "BANK_TRANSFER", "MOMO", "VNPAY"])
        .withMessage("payment_method must be one of: CASH, CREDIT_CARD, BANK_TRANSFER, MOMO, VNPAY"),
    
    body("discount_id")
        .optional()
        .isString()
        .withMessage("discount_id must be a string")
        .bail()
        .isLength({ max: 50 })
        .withMessage("discount_id must not exceed 50 characters")
        .bail()
        .custom((value) => {
            // Kiểm tra discount_id có tồn tại trong bảng Voucher không
            // Có thể thêm validation async ở đây nếu cần
            return true;
        }),
    
    body("ticket_id")
        .optional()
        .isString()
        .withMessage("ticket_id must be a string")
        .bail()
        .isLength({ max: 50 })
        .withMessage("ticket_id must not exceed 50 characters")
        .bail()
        .custom(async (value) => {
            if (value) {
                const { RepairTicket } = await import("../schemas/index.js");
                const ticket = await RepairTicket.findByPk(value);
                if (!ticket) {
                    throw new Error("Repair ticket not found");
                }
            }
            return true;
        })
];

export default invoiceValidator;