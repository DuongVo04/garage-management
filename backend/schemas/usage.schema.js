import { DataTypes } from "sequelize"

export default (sequelize) => {

    const Usage = sequelize.define("Usage", {

        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false
        },

        quantity: DataTypes.INTEGER,

        usage_date: DataTypes.DATE,

        spare_parts_id: DataTypes.STRING(50)

    }, {
        tableName: "usage",
        timestamps: false
    })

    return Usage
}