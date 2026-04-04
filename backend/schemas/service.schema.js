import { DataTypes } from "sequelize"

export default (sequelize) => {

    const Service = sequelize.define("Service", {

        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false
        },

        name: DataTypes.STRING(50),

        description: DataTypes.STRING(50),

        price: DataTypes.DECIMAL(19, 0),

        is_deleted: DataTypes.TINYINT(1)

    }, {
        // defaultScope: {
        //     attributes: { exclude: ['is_deleted'] }
        // },
        tableName: "service",
        timestamps: false
    })

    return Service
}