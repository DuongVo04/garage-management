import { DataTypes } from "sequelize"

export default (sequelize) => {

    const ShowroomVehicle = sequelize.define("ShowroomVehicle", {

        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false
        },

        name: DataTypes.STRING(100),

        year: DataTypes.INTEGER,

        old_price: DataTypes.DECIMAL(19, 0),

        new_price: DataTypes.DECIMAL(19, 0),

        status: DataTypes.BOOLEAN,

        color: DataTypes.STRING(10),

        latest_odo: DataTypes.INTEGER,

        thumbnail: DataTypes.STRING(255),

        description: DataTypes.TEXT,

        is_deleted: DataTypes.TINYINT(1),

        brand_id: DataTypes.STRING(50)

    }, {
        defaultScope: {
            attributes: { exclude: ['is_deleted'] }
        },
        tableName: "showroom_vehicle",
        timestamps: false
    })

    return ShowroomVehicle
}