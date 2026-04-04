import ApiError from "./ApiError.js";
import fs from 'fs'
import path from "path";


/**
 * @param {Model} Model - Sequelize model
 * @param {Object} options - custom config
 */
const getDefaultFilter = (Model) => {
    if (Model.rawAttributes.is_deleted) return { is_deleted: false };
    if (Model.rawAttributes.is_available) return { is_available: true };
    if (Model.rawAttributes.is_working) return { is_working: true };

    return {};
};

const buildDefaultAttributes = (Model) => {
    const byAssociation = Object.values(Model.associations)
        .map(a => a.foreignKey);

    const byNaming = Object.keys(Model.rawAttributes)
        .filter(key => key.endsWith("_id"));

    const excludeFields = [...new Set([...byAssociation, ...byNaming])];

    return {
        attributes: {
            exclude: excludeFields
        }
    };
};

export const baseCRUD = (Model, options = {}) => {
    const {
        modelName = "Item",
        uniqueFields = [],
        defaultValues = {},
        exclude = [],
        include = {
            basicInclude: [],
            detailInclude: []
        },
        customFilter = null,
        imageField = null
    } = options;

    const controller = {
        getAll: async (query = {}) => {
            const attributes = buildDefaultAttributes(Model);

            const data = await Model.findAll({
                where: customFilter
                    ? customFilter(query)
                    : getDefaultFilter(Model),
                include: include.basicInclude,
                ...attributes
            });

            return data;
        },
        getById: async (id) => {
            const attributes = buildDefaultAttributes(Model);
            const data = await Model.findOne({
                where: {
                    id,
                    ...getDefaultFilter(Model)
                },
                include: include.detailInclude,
                ...attributes
            });

            if (!data) {
                throw new ApiError(404, `${modelName} not found`);
            }

            return data;
        },

        create: async (body, uploadedFile = null) => {

            if (uniqueFields.length > 0) {
                const where = {};
                uniqueFields.forEach((field) => {
                    if (body[field]) {
                        where[field] = body[field];
                    }
                });

                const existing = await Model.findOne({
                    where: {
                        ...where,
                        ...getDefaultFilter(Model)
                    }
                });

                if (existing) {
                    throw new ApiError(409, `${modelName} already exists`);
                }
            }

            const newData = await Model.create({
                ...body,
                ...(imageField && {
                    [imageField]: uploadedFile?.path ?? null
                }),
                ...defaultValues
            });

            return newData;
        },

        update: async (id, body, uploadedFile = null) => {
            const existing = await Model.findByPk(id);

            if (!existing) {
                throw new ApiError(404, `${modelName} not found`);
            }

            let updateData = {
                ...body,
                // ...getDefaultFilter(Model)
            };

            let oldFilePath = null;

            if (uploadedFile && imageField) {
                updateData[imageField] = uploadedFile.path;

                if (existing[imageField]) {
                    oldFilePath = path.resolve(existing[imageField]);
                }
            }

            const [count] = await Model.update(updateData, {
                where: { id }
            });

            if (count === 0) {
                throw new ApiError(400, `${modelName} not updated`);
            }

            if (oldFilePath) {
                try {
                    await fs.promises.unlink(oldFilePath);
                } catch (err) {
                    console.warn("File delete failed:", err.message);
                }
            }

            const updated = await Model.findByPk(id);

            return updated;
        },

        delete: async (id) => {
            let updateData = null;

            if (Model.rawAttributes.is_deleted) {
                updateData = { is_deleted: true };
            } else if (Model.rawAttributes.is_available) {
                updateData = { is_available: false };
            } else if (Model.rawAttributes.is_working) {
                updateData = { is_working: false };
            } else {
                throw new ApiError(400, `${modelName} does not support delete`);
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
                throw new ApiError(404, `${modelName} not found`);
            }

            return true;
        },
    }

    exclude.forEach((key) => {
        delete controller[key];
    });

    return controller;
};