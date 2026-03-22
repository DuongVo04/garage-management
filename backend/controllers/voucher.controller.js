import { Voucher } from "../schemas/index.js"
import { baseCRUD } from "../utils/baseCRUD.js"

export const voucherController = baseCRUD(Voucher, {
    modelName: "Voucher",
    uniqueFields: ["voucher_code"],
    defaultValues: { is_available: true },

    customFilter: (req) => {
        const { type } = req.query;

        if (type === "all") {
            return {};
        }

        if (type === "active") {
            const now = dayjs().toDate();

            return {
                [Op.and]: [
                    { is_available: true },
                    { from: { [Op.lte]: now } },
                    { to: { [Op.gte]: now } }
                ]

            };
        }

        if (type === "disable") {
            const now = dayjs().toDate();

            return {
                [Op.or]: [
                    { is_available: false },
                    { from: { [Op.gt]: now } },
                    { to: { [Op.lt]: now } }
                ]
            };
        }

        return {
            is_available: true
        };
    }
});