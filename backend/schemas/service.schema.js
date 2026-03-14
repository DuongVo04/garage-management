import { DataTypes } from "sequelize"

export default (sequelize) => {

    const Service = sequelize.define("Service", {

        id: {
            type: DataTypes.STRING(50),
            primaryKey: true
        },

        service_name: DataTypes.STRING(50),

        description: DataTypes.STRING(50),

        price: DataTypes.DECIMAL(19, 0),

        is_deleted: DataTypes.TINYINT(1)

    }, {
        tableName: "service",
        timestamps: false
    })

    return Service
}