import { response } from "../utils/response.js"

import { Role } from "../schemas/index.js"


const getAllRoles = async (req, res, next) => {
    try {
        const roles = await Role.findAll();

        return response(res, true, "Get roles successfully", 200, roles)
    } catch (error) {
        next(error);
    }
}

const getById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const role = await Role.findByPk(id);

        if (!role) {
            return response(res, false, "Role not found", 404, null);
        }

        return response(res, true, "Role has been found", 200, role);

    } catch (error) {
        next(error);
    }
}

export {
    getAllRoles,
    getById,

};