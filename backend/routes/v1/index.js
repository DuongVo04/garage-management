import express from "express"
import authRoutes from "./auth.route.js"
import roleRoutes from "./role.route.js"
import accountRoutes from "./account.route.js"
import adminRoutes from "./admin.route.js"
import employeeTypeRoutes from "./empoyee-type.route.js"
import sparePartsRoutes from "./spare-parts.route.js"
import voucherRoutes from "./voucher.route.js"
import brandRoutes from "./brand.route.js"
import serviceRoutes from "./service.route.js"
import showroomVehicleRoutes from "./showroom-vehicle.route.js"
import vehicleSpecificationsRoutes from "./vehicle-specifications.route.js" 
import showroomVehicleImageRoutes from "./showroom-vehicle-image.route.js"
import employeeRoutes from "./employee.route.js"
import customerRoutes from "./customer.route.js"
import customerVehicleRoutes from "./customer-vehicle.route.js"
import carReviewAppointments from "./car-review-appointment.route.js"
import invoice from "./invoice.route.js"
import repairAppointmentRoutes from "./repair-appointment.route.js"
import repairTicketRoutes from "./repair-ticket.route.js"
import repairDetailRoutes from "./repair-detail.route.js"
import sparePartsWarrantyRoutes from "./spare-parts-warranty.route.js"
import sparePartsUsageRoutes from "./spare-parts-usage.route.js";


const router = express.Router();

router.use("/auth", authRoutes);
router.use("/roles", roleRoutes);
router.use("/accounts", accountRoutes);
router.use("/admin", adminRoutes);
router.use("/employee-types", employeeTypeRoutes);
router.use("/spare-parts", sparePartsRoutes);
router.use("/vouchers", voucherRoutes);
router.use("/brands", brandRoutes);
router.use("/services", serviceRoutes);
router.use("/showroom-vehicles", showroomVehicleRoutes);
router.use("/showroom-vehicles", vehicleSpecificationsRoutes);
router.use("/showroom-vehicles", showroomVehicleImageRoutes);
router.use("/employees", employeeRoutes);
router.use("/customers", customerRoutes);
router.use("/customer-vehicles", customerVehicleRoutes);
router.use("/car-review-appointments", carReviewAppointments);
router.use("/invoices", invoice);
router.use("/repair-appointments", repairAppointmentRoutes)
router.use("/repair-tickets", repairTicketRoutes)
router.use("/repair-details", repairDetailRoutes)
router.use("/spare-parts-warranties", sparePartsWarrantyRoutes)
router.use("/spare-parts-usages", sparePartsUsageRoutes);

export default router;