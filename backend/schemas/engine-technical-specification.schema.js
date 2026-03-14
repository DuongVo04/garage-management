import { DataTypes } from "sequelize"

export default (sequelize) => {

    const EngineTechnicalSpecification = sequelize.define("EngineTechnicalSpecification", {

        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false
        },

        engine_type: DataTypes.STRING(100),

        engine_capacity: DataTypes.STRING(50),

        max_power: DataTypes.DOUBLE,

        max_torque: DataTypes.STRING(50),

        showroom_vehicle_id: DataTypes.STRING(50)

    }, {
        tableName: "engine_technical_specification",
        timestamps: false
    })

    return EngineTechnicalSpecification
}