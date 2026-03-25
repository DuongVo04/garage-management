import { DataTypes } from "sequelize"

export default (sequelize) => {

    const ShowroomVehicleImage = sequelize.define("ShowroomVehicleImage", {

        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false
        },

        // description: DataTypes.STRING(50),

        image_path: DataTypes.STRING(255),

        showroom_vehicle_id: DataTypes.STRING(50)

    }, {
        tableName: "showroom_vehicle_image",
        timestamps: false
    })

    return ShowroomVehicleImage
}