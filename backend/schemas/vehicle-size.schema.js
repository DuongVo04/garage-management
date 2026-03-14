import { DataTypes } from "sequelize"

export default (sequelize) => {

    const VehicleSize = sequelize.define("VehicleSize", {

        length_mm: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },

        width_mm: DataTypes.INTEGER,

        height_mm: DataTypes.INTEGER,

        wheelbase_mm: DataTypes.INTEGER,

        showroom_vehicle_id: DataTypes.STRING(50)

    }, {
        tableName: "vehicle_size",
        timestamps: false
    })

    return VehicleSize
}