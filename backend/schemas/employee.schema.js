import { DataTypes } from "sequelize"

export default (sequelize) => {

    const Employee = sequelize.define("Employee", {

        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false
        },

        employee_name: DataTypes.STRING(50),

        phone_number: {
            type: DataTypes.STRING(10),
            unique: true
        },

        email: DataTypes.STRING(100),

        address: DataTypes.STRING(100),

        salary: DataTypes.DECIMAL(19, 0),

        work_start_date: DataTypes.DATEONLY,

        is_working: DataTypes.BOOLEAN,

        account_id: DataTypes.STRING(50),

        employee_type_id: DataTypes.STRING(50)

    }, {
        tableName: "employee",
        timestamps: false
    })

    return Employee
}