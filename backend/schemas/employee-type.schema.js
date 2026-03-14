import { DataTypes } from "sequelize"

export default (sequelize) => {

    const EmployeeType = sequelize.define("EmployeeType", {

        id: {
            type: DataTypes.STRING(50),
            primaryKey: true
        },

        name: {
            type: DataTypes.STRING(20),
            allowNull: false
        },

        description: DataTypes.TINYINT(1),

        is_deleted: {
            type: DataTypes.TINYINT(1)
        },


    }, {
        tableName: "employee_type",
        timestamps: false
    })

    return EmployeeType
}