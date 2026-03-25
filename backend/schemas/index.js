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
Role.hasMany(Account, {
    foreignKey: "role_id",
    as: "accounts"
});
Account.belongsTo(Role, {
    foreignKey: "role_id",
    as: "role"
});

Account.hasOne(Employee, {
    foreignKey: "account_id",
    as: "employee"

});
Employee.belongsTo(Account, {
    foreignKey: "account_id",
    as: "account"

});

Account.hasOne(Customer, {
    foreignKey: "account_id",
    as: "customer"

});
Customer.belongsTo(Account, {
    foreignKey: "account_id",
    as: "account"
});



/*
========================
EMPLOYEE
========================
*/

EmployeeType.hasMany(Employee, {
    foreignKey: "employee_type_id",
    as: "employees"

});
Employee.belongsTo(EmployeeType, {
    foreignKey: "employee_type_id",
    as: "employee_type"

});



/*
========================
CUSTOMER VEHICLE
========================
*/

Customer.hasMany(CustomerVehicle, {
    foreignKey: "customer_id",
    as: "vehicles"

});
CustomerVehicle.belongsTo(Customer, {
    foreignKey: "customer_id",
    as: "customer"

});

Brand.hasMany(CustomerVehicle, {
    foreignKey: "brand_id",
    as: "customer_vehicles"

});
CustomerVehicle.belongsTo(Brand, {
    foreignKey: "brand_id",
    as: "brand"

});



/*
========================
SHOWROOM VEHICLE
========================
*/

Brand.hasMany(ShowroomVehicle, {
    foreignKey: "brand_id",
    as: "showroom_vehicles"
})
ShowroomVehicle.belongsTo(Brand, {
    foreignKey: "brand_id",
    as: "brand"
})


ShowroomVehicle.hasMany(ShowroomVehicleImage, {
    foreignKey: "showroom_vehicle_id",
    as: "images"
});

ShowroomVehicleImage.belongsTo(ShowroomVehicle, {
    foreignKey: "showroom_vehicle_id",
    as: "vehicle"
});

ShowroomVehicle.hasOne(EngineTechnicalSpecification, {
    foreignKey: {
        name: "showroom_vehicle_id",
        allowNull: false
    },
    as: "engine_spec",
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
});

EngineTechnicalSpecification.belongsTo(ShowroomVehicle, {
    foreignKey: {
        name: "showroom_vehicle_id",
        allowNull: false
    },
    as: "vehicle"
});

ShowroomVehicle.hasOne(Fuel, {
    foreignKey: {
        name: "showroom_vehicle_id",
        allowNull: false
    },
    as: "fuel",
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
});
Fuel.belongsTo(ShowroomVehicle, {
    foreignKey: {
        name: "showroom_vehicle_id",
        allowNull: false
    },
    as: "vehicle"
});


ShowroomVehicle.hasOne(SteeringSystem, {
    foreignKey: {
        name: "showroom_vehicle_id",
        allowNull: false
    },
    as: "steering_system",
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
});
SteeringSystem.belongsTo(ShowroomVehicle, {
    foreignKey: {
        name: "showroom_vehicle_id",
        allowNull: false
    },
    as: "vehicle"
});


ShowroomVehicle.hasOne(VehicleSize, {
    foreignKey: {
        name: "showroom_vehicle_id",
        allowNull: false
    },
    as: "size",
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
});
VehicleSize.belongsTo(ShowroomVehicle, {
    foreignKey: {
        name: "showroom_vehicle_id",
        allowNull: false
    },
    as: "vehicle"
});


ShowroomVehicle.hasOne(Interior, {
    foreignKey: {
        name: "showroom_vehicle_id",
        allowNull: false
    },
    as: "interior",
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
});
Interior.belongsTo(ShowroomVehicle, {
    foreignKey: {
        name: "showroom_vehicle_id",
        allowNull: false
    },
    as: "vehicle"
});

/*
========================
REPAIR
========================
*/
Customer.hasMany(RepairAppointment, {
    foreignKey: "customer_id",
    as: "appointments"
});
RepairAppointment.belongsTo(Customer, {
    foreignKey: "customer_id",
    as: "customer"
});

RepairAppointment.hasOne(RepairTicket, {
    foreignKey: "appointment_id",
    as: "ticket"
});
RepairTicket.belongsTo(RepairAppointment, {
    foreignKey: "appointment_id",
    as: "appointment"
});

CustomerVehicle.hasMany(RepairTicket, {
    foreignKey: "customer_vehicle_id",
    as: "tickets"
});
RepairTicket.belongsTo(CustomerVehicle, {
    foreignKey: "customer_vehicle_id",
    as: "vehicle"
});

Service.hasMany(RepairTicket, {
    foreignKey: "service_id",
    as: "tickets"
});
RepairTicket.belongsTo(Service, {
    foreignKey: "service_id",
    as: "service"
});

/*
========================
REPAIR DETAIL
========================
*/
RepairTicket.hasMany(RepairDetail, {
    foreignKey: "ticket_id",
    as: "details"
});
RepairDetail.belongsTo(RepairTicket, {
    foreignKey: "ticket_id",
    as: "ticket"
});

Employee.hasMany(RepairDetail, {
    foreignKey: "employee_id",
    as: "details"
});
RepairDetail.belongsTo(Employee, {
    foreignKey: "employee_id",
    as: "employee"
});

SparePartsUsage.hasMany(RepairDetail, {
    foreignKey: "usage_id",
    as: "details"
});
RepairDetail.belongsTo(SparePartsUsage, {
    foreignKey: "usage_id",
    as: "usage"
});

/*
========================
SPARE PARTS
========================
*/
SpareParts.hasMany(SparePartsUsage, {
    foreignKey: "spare_parts_id",
    as: "usages"
});
SparePartsUsage.belongsTo(SpareParts, {
    foreignKey: "spare_parts_id",
    as: "spare_part"
});

SparePartsUsage.hasOne(SparePartsWarranty, {
    foreignKey: "usage_id",
    as: "warranty"
});
SparePartsWarranty.belongsTo(SparePartsUsage, {
    foreignKey: "usage_id",
    as: "usage"
});



/*
========================
CAR RETURN
========================
*/
RepairTicket.hasOne(CarReturnAppointment, {
    foreignKey: "repair_ticket_id",
    as: "car_return"
});

CarReturnAppointment.belongsTo(RepairTicket, {
    foreignKey: "repair_ticket_id",
    as: "ticket"
});


/*
========================
INVOICE
========================
*/
RepairTicket.hasOne(Invoice, {
    foreignKey: "ticket_id",
    as: "invoice"
});
Invoice.belongsTo(RepairTicket, {
    foreignKey: "ticket_id",
    as: "ticket"
});

Voucher.hasMany(Invoice, {
    foreignKey: "discount_id",
    as: "invoices"
});
Invoice.belongsTo(Voucher, {
    foreignKey: "discount_id",
    as: "voucher"
});


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