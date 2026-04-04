import { Role } from "../schemas/index.js";
import { baseCRUD } from "../utils/baseCRUD.js";
import ApiError from "../utils/ApiError.js"


const base = baseCRUD(Role, {
    modelName: "Role",
    uniqueFields: ["name"],
    defaultValues: { is_deleted: false }
});

const deleteRole = async (id) => {
    const role = await Role.findByPk(id);

    if (!role) {
        throw new ApiError(404, "Role not found");
    }

    if (role.name === "ADMIN") {
        throw new ApiError(403, "Cannot delete admin role");
    }

    return await base.delete(id);
};

export const roleController = {
    ...base,
    delete: deleteRole
};
