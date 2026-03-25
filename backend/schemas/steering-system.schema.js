import { DataTypes } from "sequelize"

export default (sequelize) => {

    const SteeringSystem = sequelize.define("SteeringSystem", {

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

        transmission: {
            type: DataTypes.STRING(100),
        },

        drivetrain: DataTypes.STRING(100),

    }, {
        tableName: "steering_system",
        timestamps: false
    })

    return SteeringSystem
}