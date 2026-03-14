import { DataTypes } from "sequelize"

export default (sequelize) => {

    const SparePartsWarranty = sequelize.define("SparePartsWarranty", {

        id: {
            type: DataTypes.STRING(50),
            primaryKey: true
        },

        start_date: DataTypes.INTEGER,

        duration: DataTypes.INTEGER,

        usage_id: DataTypes.STRING(50)

    }, {
        tableName: "spare_parts_warranty",
        timestamps: false
    })

    return SparePartsWarranty
}