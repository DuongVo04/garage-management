import { DataTypes } from "sequelize"

export default (sequelize) => {

    const VehicleSize = sequelize.define("VehicleSize", {

        showroom_vehicle_id: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            references: {
                model: "showroom_vehicle",
                key: "id"
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE"
        },

        length_mm:DataTypes.INTEGER,

        width_mm: DataTypes.INTEGER,

        height_mm: DataTypes.INTEGER,

        wheelbase_mm: DataTypes.INTEGER,


    }, {
        tableName: "vehicle_size",
        timestamps: false
    })

    return VehicleSize
}