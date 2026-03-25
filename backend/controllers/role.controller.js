import { Role } from "../schemas/index.js";
import { baseCRUD } from "../utils/baseCRUD.js";
import { response } from "../utils/response.js";

const base = baseCRUD(Role, {
    modelName: "Role",
    uniqueFields: ["name"],
    defaultValues: { is_deleted: false }
});

const deleteRole = async (req, res, next) => {
    try {
        const { id } = req.params;

        const role = await Role.findByPk(id);

        if (!role) {
            return response(res, false, "Role not found", 404);
        }

        if (role.name === "ADMIN") {
            return response(res, false, "Cannot delete admin role", 403);
        }

        return base.delete(req, res, next);

    } catch (error) {
        next(error);
    }
};

export const roleController = {
    ...base,
    delete: deleteRole
};