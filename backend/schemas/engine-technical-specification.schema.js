import { DataTypes } from "sequelize"

export default (sequelize) => {

    const EngineTechnicalSpecification = sequelize.define("EngineTechnicalSpecification", {

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

        engine_type: DataTypes.STRING(100),

        engine_capacity: DataTypes.DOUBLE,

        max_power: DataTypes.INTEGER(5),

        max_torque: DataTypes.INTEGER(5)

    }, {
        tableName: "engine_technical_specification",
        timestamps: false
    })

    return EngineTechnicalSpecification
}