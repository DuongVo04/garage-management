import { response } from "./response.js";

/**
 * @param {Model} Model - Sequelize model
 * @param {Object} options - custom config
 */
const getDefaultFilter = (Model) => {
    if (Model.rawAttributes.is_deleted) return { is_deleted: false };
    if (Model.rawAttributes.is_available) return { is_available: true };
    return {};
};
export const baseCRUD = (Model, options = {}) => {
    const {
        modelName = "Item",
        uniqueFields = [],
        defaultValues = {},
        exclude = [],
        customFilter = null,
    } = options;

    const controller = {
        getAll: async (req, res, next) => {
            try {

                const data = await Model.findAll({
                    where: customFilter
                        ? customFilter(req)
                        : getDefaultFilter(Model)
                });

                return response(res, true, `Get ${modelName.toLowerCase()}s successfully`, 200, data);
            } catch (error) {
                next(error);
            }
        },
        getById: async (req, res, next) => {
            try {
                const { id } = req.params;

                const data = await Model.findOne({
                    where: {
                        id,
                        ...getDefaultFilter(Model)
                    }
                });

                if (!data) {
                    return response(res, false, `${modelName} not found`, 404);
                }

                return response(
                    res,
                    true,
                    `${modelName} has been found`,
                    200,
                    data
                );
            } catch (error) {
                next(error);
            }
        },

        create: async (req, res, next) => {
            try {
                if (uniqueFields.length > 0) {
                    const where = {};
                    uniqueFields.forEach((field) => {
                        if (req.body[field]) {
                            where[field] = req.body[field];
                        }
                    });

                    const existing = await Model.findOne({
                        where: {
                            ...where,
                            ...getDefaultFilter(Model)
                        }
                    });

                    if (existing) {
                        return response(
                            res,
                            false,
                            `${modelName} already exists`,
                            409
                        );
                    }
                }

                const newData = await Model.create({
                    ...req.body,
                    ...defaultValues
                });

                return response(
                    res,
                    true,
                    `Create ${modelName.toLowerCase()} successfully`,
                    201,
                    newData
                );
            } catch (error) {
                next(error);
            }
        },

        update: async (req, res, next) => {
            try {
                const { id } = req.params;

                const [count] = await Model.update(
                    {
                        ...req.body,
                        ...getDefaultFilter(Model)
                    },
                    { where: { id } }
                );

                if (count === 0) {
                    return response(
                        res,
                        false,
                        `${modelName} not found or no change`,
                        404
                    );
                }

                const updated = await Model.findByPk(id);

                return response(
                    res,
                    true,
                    "Updated successfully",
                    200,
                    updated
                );
            } catch (error) {
                next(error);
            }
        },

        delete: async (req, res, next) => {
            try {
                const { id } = req.params;

                let updateData = null;

                if (Model.rawAttributes.is_deleted) {
                    updateData = { is_deleted: true };
                } else if (Model.rawAttributes.is_available) {
                    updateData = { is_available: false };
                } else {
                    return response(
                        res,
                        false,
                        `${modelName} does not support delete`,
                        400
                    );
                }

                const defaultFilter = getDefaultFilter(Model);

                const [count] = await Model.update(
                    updateData,
                    {
                        where: {
                            id,
                            ...defaultFilter
                        }
                    }
                );

                if (!count) {
                    return response(
                        res,
                        false,
                        `${modelName} not found`,
                        404
                    );
                }

                return response(
                    res,
                    true,
                    `${modelName} deleted`,
                    200
                );
            } catch (error) {
                next(error);
            }
        },
    }

    exclude.forEach((key) => {
        delete controller[key];
    });

    return controller;
};