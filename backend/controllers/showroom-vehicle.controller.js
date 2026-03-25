import {
    Brand,
    ShowroomVehicle,
    ShowroomVehicleImage,
    EngineTechnicalSpecification,
    SteeringSystem,
    Fuel,
    VehicleSize,
    Interior,

} from "../schemas/index.js"
import { basePFKCRUD } from "../utils/basePFKCRUD.js";
import { baseCRUD } from "../utils/baseCRUD.js"


const basicInclude = [{
    model: Brand,
    as: "brand",
    attributes: ["name", "country", "logo_url"]
}];

const detailInclude = [
    ...basicInclude,
    {
        model: ShowroomVehicleImage,
        as: "images",
        attributes: ["id", "image_path"]
    },
    {
        model: EngineTechnicalSpecification,
        as: "engine_spec",
        attributes: {
            exclude: ["showroom_vehicle_id"]
        }
    },
    {
        model: SteeringSystem,
        as: "steering_system",
        attributes: {
            exclude: ["showroom_vehicle_id"]
        }
    },
    {
        model: Fuel,
        as: "fuel",
        attributes: {
            exclude: ["showroom_vehicle_id"]
        }
    },
    {
        model: VehicleSize,
        as: "size",
        attributes: {
            exclude: ["showroom_vehicle_id"]
        }
    },
    {
        model: Interior,
        as: "interior",
        attributes: {
            exclude: ["showroom_vehicle_id"]
        }
    }];

const showroomVehicleController = baseCRUD(ShowroomVehicle, {
    modelName: "ShowroomVehicle",
    defaultValues: { is_deleted: false },
    include: {
        basicInclude: basicInclude,
        detailInclude: detailInclude,
    },
    imageField: "thumbnail"
});


export default showroomVehicleController;