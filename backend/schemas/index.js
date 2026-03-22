import sequelize from "../database-connection.js"

import RoleModel from "./role.schema.js"
import AccountModel from "./account.schema.js"
import EmployeeModel from "./employee.schema.js"
import EmployeeTypeModel from "./employee-type.schema.js"

import CustomerModel from "./customer.schema.js"
import CustomerVehicleModel from "./customer-vehicle.schema.js"

import BrandModel from "./brand.schema.js"

import ShowroomVehicleModel from "./showroom-vehicle.schema.js"
import ShowroomVehicleImageModel from "./showroom-vehicle-image.schema.js"

import EngineTechnicalSpecificationModel from "./engine-technical-specification.schema.js"
import FuelModel from "./fuel.schema.js"
import SteeringSystemModel from "./steering-system.schema.js"
import VehicleSizeModel from "./vehicle-size.schema.js"
import InteriorModel from "./interior.schema.js"

import ServiceModel from "./service.schema.js"

import RepairTicketModel from "./repair-ticket.schema.js"
import RepairDetailModel from "./repair-detail.schema.js"
import RepairAppointmentModel from "./repair-appointment.schema.js"
import CarReturnAppointmentModel from "./car-return-appointment.schema.js"

import SparePartsModel from "./spare-parts.schema.js"
import SparePartsUsageModel from "./spare_parts_usage.schema.js"
import SparePartsWarrantyModel from "./spare-parts-warranty.schema.js"

import InvoiceModel from "./invoice.schema.js"
import VoucherModel from "./voucher.schema.js"



// initialize models
const Role = RoleModel(sequelize)
const Account = AccountModel(sequelize)
const Employee = EmployeeModel(sequelize)
const EmployeeType = EmployeeTypeModel(sequelize)

const Customer = CustomerModel(sequelize)
const CustomerVehicle = CustomerVehicleModel(sequelize)

const Brand = BrandModel(sequelize)

const ShowroomVehicle = ShowroomVehicleModel(sequelize)
const ShowroomVehicleImage = ShowroomVehicleImageModel(sequelize)

const EngineTechnicalSpecification = EngineTechnicalSpecificationModel(sequelize)
const Fuel = FuelModel(sequelize)
const SteeringSystem = SteeringSystemModel(sequelize)
const VehicleSize = VehicleSizeModel(sequelize)
const Interior = InteriorModel(sequelize)

const Service = ServiceModel(sequelize)

const RepairTicket = RepairTicketModel(sequelize)
const RepairDetail = RepairDetailModel(sequelize)
const RepairAppointment = RepairAppointmentModel(sequelize)
const CarReturnAppointment = CarReturnAppointmentModel(sequelize)

const SpareParts = SparePartsModel(sequelize)
const SparePartsUsage = SparePartsUsageModel(sequelize)
const SparePartsWarranty = SparePartsWarrantyModel(sequelize)

const Invoice = InvoiceModel(sequelize)
const Voucher = VoucherModel(sequelize)



/*
========================
ACCOUNT RELATION
========================
*/
Role.hasMany(Account, { foreignKey: "role_id" })
Account.hasOne(Employee, { foreignKey: "account_id" })
Employee.belongsTo(Account, { foreignKey: "account_id" })

Account.belongsTo(Role, { foreignKey: "role_id" })
Account.hasOne(Customer, { foreignKey: "account_id" })
Customer.belongsTo(Account, { foreignKey: "account_id" })



/*
========================
EMPLOYEE
========================
*/

EmployeeType.hasMany(Employee, { foreignKey: "employee_type_id" })
Employee.belongsTo(EmployeeType, { foreignKey: "employee_type_id" })



/*
========================
CUSTOMER VEHICLE
========================
*/

Customer.hasMany(CustomerVehicle, { foreignKey: "customer_id" })
CustomerVehicle.belongsTo(Customer, { foreignKey: "customer_id" })

Brand.hasMany(CustomerVehicle, { foreignKey: "brand_id" })
CustomerVehicle.belongsTo(Brand, { foreignKey: "brand_id" })



/*
========================
SHOWROOM VEHICLE
========================
*/

Brand.hasMany(ShowroomVehicle, { foreignKey: "brand_id" })
ShowroomVehicle.belongsTo(Brand, { foreignKey: "brand_id" })


ShowroomVehicle.hasMany(ShowroomVehicleImage, {
    foreignKey: "showroom_vehicle_id"
})

ShowroomVehicleImage.belongsTo(ShowroomVehicle, {
    foreignKey: "showroom_vehicle_id"
})


EngineTechnicalSpecification.belongsTo(ShowroomVehicle, {
    foreignKey: "showroom_vehicle_id"
})

ShowroomVehicle.hasOne(EngineTechnicalSpecification, {
    foreignKey: "showroom_vehicle_id"
})


Fuel.belongsTo(ShowroomVehicle, {
    foreignKey: "showroom_vehicle_id"
})

ShowroomVehicle.hasOne(Fuel, {
    foreignKey: "showroom_vehicle_id"
})


SteeringSystem.belongsTo(ShowroomVehicle, {
    foreignKey: "showroom_vehicle_id"
})

ShowroomVehicle.hasOne(SteeringSystem, {
    foreignKey: "showroom_vehicle_id"
})


VehicleSize.belongsTo(ShowroomVehicle, {
    foreignKey: "showroom_vehicle_id"
})

ShowroomVehicle.hasOne(VehicleSize, {
    foreignKey: "showroom_vehicle_id"
})


Interior.belongsTo(ShowroomVehicle, {
    foreignKey: "showroom_vehicle_id"
})

ShowroomVehicle.hasOne(Interior, {
    foreignKey: "showroom_vehicle_id"
})



/*
========================
REPAIR
========================
*/

RepairAppointment.belongsTo(Customer, {
    foreignKey: "customer_id"
})

Customer.hasMany(RepairAppointment, {
    foreignKey: "customer_id"
})


RepairTicket.belongsTo(RepairAppointment, {
    foreignKey: "appointment_id"
})

RepairAppointment.hasOne(RepairTicket, {
    foreignKey: "appointment_id"
})


RepairTicket.belongsTo(CustomerVehicle, {
    foreignKey: "customer_vehicle_id"
})

CustomerVehicle.hasMany(RepairTicket, {
    foreignKey: "customer_vehicle_id"
})


RepairTicket.belongsTo(Service, {
    foreignKey: "service_id"
})

Service.hasMany(RepairTicket, {
    foreignKey: "service_id"
})



/*
========================
REPAIR DETAIL
========================
*/

RepairTicket.hasMany(RepairDetail, {
    foreignKey: "ticket_id"
})

RepairDetail.belongsTo(RepairTicket, {
    foreignKey: "ticket_id"
})


Employee.hasMany(RepairDetail, {
    foreignKey: "employee_id"
})

RepairDetail.belongsTo(Employee, {
    foreignKey: "employee_id"
})


RepairDetail.belongsTo(SparePartsUsage, {
    foreignKey: "usage_id"
})

SparePartsUsage.hasMany(RepairDetail, {
    foreignKey: "usage_id"
})



/*
========================
SPARE PARTS
========================
*/

SpareParts.hasMany(SparePartsUsage, {
    foreignKey: "spare_parts_id"
})

SparePartsUsage.belongsTo(SpareParts, {
    foreignKey: "spare_parts_id"
})


SparePartsUsage.hasOne(SparePartsWarranty, {
    foreignKey: "usage_id"
})

SparePartsWarranty.belongsTo(SparePartsUsage, {
    foreignKey: "usage_id"
})



/*
========================
CAR RETURN
========================
*/

RepairTicket.hasOne(CarReturnAppointment, {
    foreignKey: "repair_ticket_id"
})

CarReturnAppointment.belongsTo(RepairTicket, {
    foreignKey: "repair_ticket_id"
})



/*
========================
INVOICE
========================
*/

RepairTicket.hasOne(Invoice, {
    foreignKey: "ticket_id"
})

Invoice.belongsTo(RepairTicket, {
    foreignKey: "ticket_id"
})


Voucher.hasMany(Invoice, {
    foreignKey: "discount_id"
})

Invoice.belongsTo(Voucher, {
    foreignKey: "discount_id"
})



export {
    sequelize,

    Role,
    Account,
    Employee,
    EmployeeType,

    Customer,
    CustomerVehicle,

    Brand,

    ShowroomVehicle,
    ShowroomVehicleImage,

    EngineTechnicalSpecification,
    Fuel,
    SteeringSystem,
    VehicleSize,
    Interior,

    Service,

    RepairTicket,
    RepairDetail,
    RepairAppointment,
    CarReturnAppointment,

    SpareParts,
    SparePartsUsage,
    SparePartsWarranty,

    Invoice,
    Voucher
}