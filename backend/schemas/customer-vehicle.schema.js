import { DataTypes } from "sequelize"

export default (sequelize) => {

    const CustomerVehicle = sequelize.define("CustomerVehicle", {

        id: {
            type: DataTypes.STRING(50),
            primaryKey: true
        },

        name: DataTypes.STRING(20),

        color: DataTypes.STRING(10),

        type: DataTypes.STRING(10),

        plate_number: DataTypes.STRING(20),

        is_latest_od: DataTypes.INTEGER,

        year: DataTypes.INTEGER,

        image: DataTypes.STRING(255),

        customer_id: DataTypes.STRING(50),

        is_deleted: DataTypes.TINYINT(1),

        brand_id: DataTypes.STRING(50)

    }, {
        tableName: "customer_vehicle",
        timestamps: false
    })

    return CustomerVehicle
}