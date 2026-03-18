import express from "express"
import authRoutes from "./auth.route.js"
import roleRoutes from "./role.route.js"
import accountRoutes from "./account.route.js"
import adminRoutes from "./admin.route.js"


const router = express.Router();

router.use("/auth", authRoutes);
router.use("/roles", roleRoutes);
router.use("/accounts", accountRoutes);
router.use("/admin", adminRoutes)

export default router;