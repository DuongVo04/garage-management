import { body } from "express-validator";

const invoiceValidator = [
    body("created_date")
        .optional({ nullable: true })
        .custom((value) => {
            if (value == null || value === "") return true;
            if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
                throw new Error("created_date must be in format YYYY-MM-DD");
            }
            return true;
        }),

    body("total_cost")
        .optional({ nullable: true })
        .custom((value) => {
            if (value == null || value === "") return true;
            const num = Number(value);
            if (isNaN(num) || num < 0) {
                throw new Error("total_cost must be a non-negative number");
            }
            return true;
        }),

    body("payment_method")
        .optional({ nullable: true })
        .custom((value) => {
            if (value == null || value === "") return true;
            const allowed = ["CASH", "CREDIT_CARD", "BANK_TRANSFER", "MOMO", "VNPAY"];
            if (!allowed.includes(value)) {
                throw new Error(`payment_method must be one of: ${allowed.join(", ")}`);
            }
            return true;
        }),

    body("discount_id")
        .optional({ nullable: true }),

    body("ticket_id")
        .optional({ nullable: true })
];

export default invoiceValidator;
