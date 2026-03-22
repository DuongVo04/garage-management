import express from "express"
import authRoutes from "./auth.route.js"
import roleRoutes from "./role.route.js"
import accountRoutes from "./account.route.js"
import adminRoutes from "./admin.route.js"
import employeeRoutes from "./empoyee-type.route.js"
import sparePartsRoutes from "./spare-parts.route.js"
import voucherRoutes from "./voucher.route.js"
import brandRoutes from "./brand.route.js"


const router = express.Router();

router.use("/auth", authRoutes);
router.use("/roles", roleRoutes);
router.use("/accounts", accountRoutes);
router.use("/admin", adminRoutes);
router.use("/employee-types", employeeRoutes);
router.use("/spare-parts", sparePartsRoutes);
router.use("/vouchers", voucherRoutes);
router.use("/brands", brandRoutes);

export default router;