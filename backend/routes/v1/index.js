import express from "express"
import roleRoutes from "./role.route.js"

const router = express.Router();

router.use("/roles", roleRoutes);

export default router;