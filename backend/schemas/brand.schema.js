import { DataTypes } from "sequelize"

export default (sequelize) => {

    const Brand = sequelize.define("Brand", {

        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false
        },

        name: {
            type: DataTypes.STRING(100),
            unique: true
        },

        country: {
            type: DataTypes.STRING(100)
        },

        logo_url: {
            type: DataTypes.STRING(255)
        },

        is_deleted: DataTypes.TINYINT(1),

    }, {
        defaultScope: {
            attributes: { exclude: ['is_deleted'] }
        },
        tableName: "brand",
        timestamps: false
    })

    return Brand;
}
