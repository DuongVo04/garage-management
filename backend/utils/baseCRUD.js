import { response } from "./response.js";

/**
 * @param {Model} Model - Sequelize model
 * @param {Object} options - custom config
 */
export const baseCRUD = (Model, options = {}) => {
    const {
        modelName = "Item",
        uniqueFields = [],
        defaultValues = {},
    } = options;

    return {
        getAll: async (req, res, next) => {
            try {
                const data = await Model.findAll({
                    where: {
                        ...(Model.rawAttributes.is_deleted && { is_deleted: false })
                    }
                });

                return response(
                    res,
                    true,
                    `Get ${modelName.toLowerCase()}s successfully`,
                    200,
                    data
                );
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
                        ...(Model.rawAttributes.is_deleted && { is_deleted: false })
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
                            ...(Model.rawAttributes.is_deleted && { is_deleted: false })
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
                        ...(Model.rawAttributes.is_deleted && { is_deleted: false })
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

                const [count] = await Model.update(
                    Model.rawAttributes.is_deleted
                        ? { is_deleted: true }
                        : {},
                    { where: { id } }
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
    };
};