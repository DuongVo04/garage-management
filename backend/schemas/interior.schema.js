import { DataTypes } from "sequelize"

export default (sequelize) => {

    const Interior = sequelize.define("Interior", {

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

        seat_count: {
            type: DataTypes.INTEGER,
        },

        is_androidauto_applecarplay: DataTypes.BOOLEAN,

    }, {
        tableName: "interior",
        timestamps: false
    })

    return Interior
}