import {
    ShowroomVehicle,
    EngineTechnicalSpecification,
    SteeringSystem,
    Fuel,
    VehicleSize,
    Interior,

} from "../schemas/index.js"
import { basePFKCRUD } from "../utils/basePFKCRUD.js";


export const size = basePFKCRUD(VehicleSize, {
    modelName: "VehicleSize",
    primaryKey: "showroom_vehicle_id"
});

export const steering = basePFKCRUD(SteeringSystem, {
    modelName: "SteeringSystem",
    primaryKey: "showroom_vehicle_id"
});

export const fuel = basePFKCRUD(Fuel, {
    modelName: "Fuel",
    primaryKey: "showroom_vehicle_id"
});

export const engine = basePFKCRUD(EngineTechnicalSpecification, {
    modelName: "EngineTechnicalSpecification",
    primaryKey: "showroom_vehicle_id"
});

export const interior = basePFKCRUD(Interior, {
    modelName: "Fuel",
    primaryKey: "showroom_vehicle_id"
});