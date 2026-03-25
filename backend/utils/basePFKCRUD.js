import { response } from "./response.js";
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

        async getOne(req, res, next) {
            try {
                const where = getPrimaryKey(req.params, primaryKey);

                const data = await Model.findOne({ where, include });

                if (!data) {
                    return response(res, false, `${modelName} not found`, 404);
                }

                return response(res, true, "Success", 200, data);
            } catch (err) {
                next(err);
            }
        },

        async create(req, res, next) {
            try {
                const key = getPrimaryKey(req.params, primaryKey);
                console.log({                    ...req.body,
                    ...key});
                const data = await Model.create({
                    ...req.body,
                    ...key
                });

                return response(res, true, "Created successfully", 201, data);
            } catch (err) {
                next(err);
            }
        },

        async update(req, res, next) {
            try {
                const where = getPrimaryKey(req.params, primaryKey);

                const [affected] = await Model.update({
                    ...req.body,
                    ...where
                }, { where });

                if (affected === 0) {
                    const exists = await Model.findOne({ where });

                    if (!exists) {
                        return response(res, false, `${modelName} not found`, 404);
                    }

                    return response(res, true, "No changes detected", 200, exists);
                }

                const updated = await Model.findOne({ where });

                return response(res, true, "Updated successfully", 200, updated);

            } catch (err) {
                next(err);
            }
        },

        async delete(req, res, next) {
            try {
                const where = getPrimaryKey(req.params, primaryKey);

                const deleted = await Model.destroy({ where });

                if (!deleted) {
                    return response(res, false, `${modelName} not found`, 404);
                }

                return response(res, true, "Deleted permanently", 200);
            } catch (err) {
                next(err);
            }
        }
    };
};

export default basePFKCRUD;