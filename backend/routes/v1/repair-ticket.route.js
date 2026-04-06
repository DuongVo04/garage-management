import express from "express"
import { repairTicketController } from "../../controllers/repair-ticket.controller.js"
import { paramsIdValidator } from "../../validators/id.validator.js"
import { validate } from "../../middlewares/validation.middleware.js"
import { authorize, verifyToken } from "../../middlewares/auth.middleware.js"
import repairTicketValidator from "../../validators/repair-ticket.validator.js"
import { response } from "../../utils/response.js"

const router = express.Router();

// Lấy danh sách phiếu sửa chữa
router.get("/",
    verifyToken,
    authorize(["ADMIN", "EMPLOYEE"]),
    async (req, res, next) => {
        console.log("🔹 [GET /repair-tickets] Request started");
        try {
            // Import schemas
            console.log("🔹 [GET /repair-tickets] Importing schemas...");
            const { Service, CustomerVehicle, RepairAppointment } = await import("../../schemas/index.js");
            console.log("✅ [GET /repair-tickets] Schemas imported successfully");
            
            // Get all repair tickets
            console.log("🔹 [GET /repair-tickets] Fetching all repair tickets...");
            let repairTickets = await repairTicketController.getAll(req.query);
            console.log(`✅ [GET /repair-tickets] Found ${repairTickets?.length || 0} repair tickets`);
            
            if (!repairTickets || repairTickets.length === 0) {
                console.log("⚠️  [GET /repair-tickets] No repair tickets found, returning empty array");
                return response(res, true, "Get repair tickets successfully", 200, []);
            }
            
            // Convert to plain objects
            console.log("🔹 [GET /repair-tickets] Converting tickets to JSON...");
            let tickets = repairTickets.map(t => t.toJSON ? t.toJSON() : t);
            console.log(`✅ [GET /repair-tickets] Converted ${tickets.length} tickets`);
            
            // Enrich each ticket with related data
            console.log("🔹 [GET /repair-tickets] Enriching tickets with related data...");
            for (let i = 0; i < tickets.length; i++) {
                const ticket = tickets[i];
                console.log(`\n📦 [Ticket ${i + 1}/${tickets.length}] ID: ${ticket.id}`);
                
                // Fetch Service
                if (ticket.service_id) {
                    try {
                        console.log(`  🔹 Fetching Service for ID: ${ticket.service_id}`);
                        const service = await Service.findOne({
                            where: { id: ticket.service_id },
                            attributes: ["id", "name", "price", "description"]
                        });
                        if (service) {
                            ticket.service = service.toJSON ? service.toJSON() : service;
                            console.log(`  ✅ Service found: ${ticket.service.name}`);
                        } else {
                            console.log(`  ⚠️  Service not found for ID: ${ticket.service_id}`);
                            ticket.service = null;
                        }
                    } catch (err) {
                        console.error(`  ❌ Error fetching service: ${err.message}`);
                        ticket.service = null;
                    }
                }
                
                // Fetch CustomerVehicle
                if (ticket.customer_vehicle_id) {
                    try {
                        console.log(`  🔹 Fetching Vehicle for ID: ${ticket.customer_vehicle_id}`);
                        const vehicle = await CustomerVehicle.findOne({
                            where: { id: ticket.customer_vehicle_id },
                            attributes: ["id", "name", "plate_number", "brand_id", "year"]
                        });
                        if (vehicle) {
                            ticket.vehicle = vehicle.toJSON ? vehicle.toJSON() : vehicle;
                            console.log(`  ✅ Vehicle found: ${ticket.vehicle.name} (${ticket.vehicle.plate_number})`);
                        } else {
                            console.log(`  ⚠️  Vehicle not found for ID: ${ticket.customer_vehicle_id}`);
                            ticket.vehicle = null;
                        }
                    } catch (err) {
                        console.error(`  ❌ Error fetching vehicle: ${err.message}`);
                        ticket.vehicle = null;
                    }
                }
                
                // Fetch RepairAppointment
                if (ticket.appointment_id) {
                    try {
                        console.log(`  🔹 Fetching Appointment for ID: ${ticket.appointment_id}`);
                        const appointment = await RepairAppointment.findOne({
                            where: { id: ticket.appointment_id },
                            attributes: ["id", "appointment_date", "status"]
                        });
                        if (appointment) {
                            ticket.appointment = appointment.toJSON ? appointment.toJSON() : appointment;
                            console.log(`  ✅ Appointment found: ${ticket.appointment.status}`);
                        } else {
                            console.log(`  ⚠️  Appointment not found for ID: ${ticket.appointment_id}`);
                            ticket.appointment = null;
                        }
                    } catch (err) {
                        console.error(`  ❌ Error fetching appointment: ${err.message}`);
                        ticket.appointment = null;
                    }
                }
            }
            
            console.log(`\n✅ [GET /repair-tickets] Successfully enriched ${tickets.length} tickets`);
            return response(res, true, "Get repair tickets successfully", 200, tickets);
        } catch (error) {
            console.error("❌ [GET /repair-tickets] CRITICAL ERROR:", error.message);
            console.error("Stack trace:", error.stack);
            return response(res, false, `Backend error: ${error.message}`, 500, { error: error.message, stack: error.stack });
        }
    }
);

// Lấy chi tiết phiếu sửa chữa
router.get("/:id",
    verifyToken,
    authorize(["ADMIN", "EMPLOYEE"]),
    paramsIdValidator(),
    validate,
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const repairTicket = await repairTicketController.getById(id);
            return response(res, true, "Repair ticket found", 200, repairTicket);
        } catch (error) {
            next(error);
        }
    }
);

// Tạo phiếu sửa chữa mới
router.post("/",
    verifyToken,
    authorize(["ADMIN", "EMPLOYEE"]),
    repairTicketValidator,
    validate,
    async (req, res, next) => {
        try {
            const repairTicket = await repairTicketController.create(req.body);
            return response(res, true, "Create repair ticket successfully", 201, repairTicket);
        } catch (error) {
            next(error);
        }
    }
);

// Cập nhật phiếu sửa chữa
router.put("/:id",
    verifyToken,
    authorize(["ADMIN", "EMPLOYEE"]),
    paramsIdValidator(),
    repairTicketValidator,
    validate,
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const repairTicket = await repairTicketController.update(id, req.body);
            return response(res, true, "Update repair ticket successfully", 200, repairTicket);
        } catch (error) {
            next(error);
        }
    }
);

// Xóa phiếu sửa chữa
router.delete("/:id",
    verifyToken,
    authorize(["ADMIN"]),
    paramsIdValidator(),
    validate,
    async (req, res, next) => {
        try {
            const { id } = req.params;
            await repairTicketController.delete(id);
            return response(res, true, "Repair ticket deleted", 200);
        } catch (error) {
            next(error);
        }
    }
);

// Hoàn thành phiếu sửa chữa
router.patch("/:id/complete",
    verifyToken,
    authorize(["ADMIN", "EMPLOYEE"]),
    paramsIdValidator(),
    validate,
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const completedDate = new Date().toISOString().split('T')[0];
            const repairTicket = await repairTicketController.update(id, { 
                completed_date: completedDate 
            });
            return response(res, true, "Repair ticket completed", 200, repairTicket);
        } catch (error) {
            next(error);
        }
    }
);

// Lấy phiếu sửa chữa theo customer vehicle
router.get("/vehicle/:vehicleId",
    verifyToken,
    authorize(["ADMIN", "EMPLOYEE", "CUSTOMER"]),
    paramsIdValidator("vehicleId"),
    validate,
    async (req, res, next) => {
        try {
            const { vehicleId } = req.params;
            const repairTickets = await repairTicketController.getAll({
                customer_vehicle_id: vehicleId
            });
            return response(res, true, "Get repair tickets by vehicle successfully", 200, repairTickets);
        } catch (error) {
            next(error);
        }
    }
);

export default router;