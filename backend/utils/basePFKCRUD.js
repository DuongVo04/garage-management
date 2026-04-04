import ApiError from "./ApiError.js";

const getPrimaryKey = (params, primaryKey) => {
    const value = params[primaryKey];

    if (value === undefined) {
        throw new ApiError(400, `Missing param: ${primaryKey}`);
    }

    return { [primaryKey]: value };
};

export const basePFKCRUD = (Model, options = {}) => {
    const {
        modelName = "Item",
        primaryKey,
        include = []
    } = options;

    if (!primaryKey) {
        throw new ApiError(500, "primaryKey is required");
    }

    return {

        async getOne(params) {
            const where = getPrimaryKey(params, primaryKey);

            const data = await Model.findOne({ where, include });

            if (!data) {
                throw new ApiError(404, `${modelName} not found`);
            }

            return data;
        },

        async create(params, body) {
            const key = getPrimaryKey(params, primaryKey);
            const data = await Model.create({
                ...body,
                ...key
            });

            return data;
        },

        async update(params, body) {
            const where = getPrimaryKey(params, primaryKey);

            const [affected] = await Model.update({
                ...body,
                ...where
            }, { where });

            if (affected === 0) {
                const exists = await Model.findOne({ where });

                if (!exists) {
                    throw new ApiError(404, `${modelName} not found`);
                }

                return exists;
            }

            const updated = await Model.findOne({ where });

            return updated;
        },

        async delete(params) {
            const where = getPrimaryKey(params, primaryKey);

            const deleted = await Model.destroy({ where });

            if (!deleted) {
                throw new ApiError(404, `${modelName} not found`);
            }

            return true;
        }
    };
};

export default basePFKCRUD;
