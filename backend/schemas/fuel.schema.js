import { DataTypes } from "sequelize"

export default (sequelize) => {

    const Fuel = sequelize.define("Fuel", {

        fuel_type: {
            type: DataTypes.STRING(100),
            primaryKey: true
        },

        fuel_consumption: DataTypes.STRING(50),

        fuel_tank_capacity: DataTypes.STRING(50),

        showroom_vehicle_id: DataTypes.STRING(50)

    }, {
        tableName: "fuel",
        timestamps: false
    })

    return Fuel
}