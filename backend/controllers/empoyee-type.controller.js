import { response } from "../utils/response.js"
import { EmployeeType } from "../schemas/index.js"


const getAllEmployeeType = async (req, res, next) => {
    try {
        const eTypes = await EmployeeType.findAll({
            where: {
                is_deleted: false
            }
        })
        response(res, true, "Get all employee types successfully", 200, eTypes);
    } catch (error) {
        next(error);
    }
};

const getById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const type = await EmployeeType.findOne({
            where: {
                id,
                is_deleted: false
            }
        });

        if (!type) {
            return response(res, false, "Employee type do not existed", 404);
        }

        response(res, true, "Get employee type successfully", 200, type);

    } catch (error) {
        next(error);
    }
};

const createEmployeeType = async (req, res, next) => {
    try {

        const { name, description } = req.body;

        const existingType = await EmployeeType.findOne({
            where: {
                name,
                is_deleted: false
            }
        });
        if (existingType) {
            return response(res, false, "Exsted employee type", 409);
        }

        const newType = await EmployeeType.create({ name, description, is_deleted: false });
        return response(res, true, "Create role successfully", 201, newType);

    } catch (error) {
        next(error);
    }
};


const updateEmployeeType = async (req, res, next) => {
    try {

        const { id } = req.params;
        const [count] = await EmployeeType.update(
            { ...req.body, is_deleted: false },
            { where: { id } }
        );

        if (count === 0) {
            return response(res, false, "Not found or no change", 404);
        }

        const updatedType = await EmployeeType.findByPk(id);
        return response(res, true, "Updated successfully", 200, updatedType);

    } catch (error) {
        next(error);
    }
};

const deletEmployeeType = async (req, res, next) => {
    try {

        const { id } = req.params;

        const count = await EmployeeType.update(
            { is_deleted: true },
            { where: { id } }
        );
        if (!count) {
            return response(res, false, "Employee type not found", 404);
        }

        return response(res, true, "Employee types deleted", 200);

    } catch (error) {
        next(error);
    }
};

export {
    getAllEmployeeType,
    getById,
    createEmployeeType,
    updateEmployeeType,
    deletEmployeeType
}