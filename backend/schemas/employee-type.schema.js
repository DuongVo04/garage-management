import { DataTypes } from "sequelize"

export default (sequelize) => {

    const EmployeeType = sequelize.define("EmployeeType", {

        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false
        },

        name: {
            type: DataTypes.STRING(20),
            allowNull: false
        },

        description: DataTypes.TEXT,

        is_deleted: {
            type: DataTypes.TINYINT(1)
        },


    }, {
        defaultScope: {
            attributes: { exclude: ['is_deleted'] }
        },
        tableName: "employee_type",
        timestamps: false
    })

    return EmployeeType
}