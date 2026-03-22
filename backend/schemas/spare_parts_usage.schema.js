import { DataTypes } from "sequelize"

export default (sequelize) => {

    const SparePartsUsage = sequelize.define("SparePartsUsage", {

        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false
        },

        quantity: DataTypes.INTEGER,

        usage_date: DataTypes.DATEONLY,

        spare_parts_id: DataTypes.STRING(50)

    }, {
        tableName: "spare_parts_usage",
        timestamps: false
    })

    return SparePartsUsage
}