import { response } from "../utils/response.js"
import { Role } from "../schemas/index.js"


const getAllRoles = async (req, res, next) => {
    try {
        const roles = await Role.findAll({
            where: {
                is_deleted: false
            }
        });

        return response(res, true, "Get roles successfully", 200, roles)
    } catch (error) {
        next(error);
    }
}

const getById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const role = await Role.findOne({
            where: {
                id: id,
                is_deleted: false
            }
        });

        if (!role) {
            return response(res, false, "Role not found", 404);
        }

        return response(res, true, "Role has been found", 200, role);

    } catch (error) {
        next(error);
    }
}

const createRole = async (req, res, next) => {
    try {
        const { name, description } = req.body;

        const existingRole = await Role.findOne({
            where: {
                name,
                is_deleted: false
            }
        });
        if (existingRole) {
            return response(res, false, "Exsted role", 409);
        }

        const newRole = await Role.create({ name, description, is_deleted: false });
        return response(res, true, "Create role successfully", 201, newRole);

    } catch (error) {
        next(error);
    }
}

const updateRole = async (req, res, next) => {
    try {
        const { id } = req.params;

        const [count, [updatedRole]] = await Role.update(
            { ...req.body, is_deleted: false },
            { where: { id }, returning: true }
        );

        if (!count) {
            return response(res, false, "Role not found", 404);
        }

        return response(res, true, "Role updated", 200, updatedRole);

    } catch (error) {
        next(error);
    }
};

const deleteRole = async (req, res, next) => {
    try {

        const { id } = req.params;

        const count = await Role.update(
            { is_deleted: true },
            { where: { id } }
        );
        if (!count) {
            return response(res, false, "Role not found", 404);
        }

        return response(res, true, "Role deleted", 200);

    } catch (error) {
        next(error);
    }
}

export {
    getAllRoles,
    getById,
    createRole,
    updateRole,
    deleteRole,

};