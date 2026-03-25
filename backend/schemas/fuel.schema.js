import { DataTypes } from "sequelize"

export default (sequelize) => {

    const Fuel = sequelize.define("Fuel", {

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

        fuel_type: {
            type: DataTypes.STRING(100),
        },

        fuel_consumption: DataTypes.STRING(50),

        fuel_tank_capacity: DataTypes.STRING(50),


    }, {
        tableName: "fuel",
        timestamps: false
    })

    return Fuel
}