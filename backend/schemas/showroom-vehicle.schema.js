import { DataTypes } from "sequelize"

export default (sequelize) => {

    const ShowroomVehicle = sequelize.define("ShowroomVehicle", {

        id: {
            type: DataTypes.STRING(50),
            primaryKey: true
        },

        name: DataTypes.STRING(100),

        year: DataTypes.INTEGER,

        old_price: DataTypes.DECIMAL(19, 0),

        new_price: DataTypes.DECIMAL(19, 0),

        status: DataTypes.BOOLEAN,

        color: DataTypes.STRING(10),

        is_latest_od: DataTypes.INTEGER,

        thumbnail: DataTypes.STRING(255),

        description: DataTypes.STRING(255),

        is_deleted: DataTypes.TINYINT(1),

        brand_id: DataTypes.STRING(50)

    }, {
        tableName: "showroom_vehicle",
        timestamps: false
    })

    return ShowroomVehicle
}