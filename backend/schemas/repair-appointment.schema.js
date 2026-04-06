import { DataTypes } from "sequelize"

export default (sequelize) => {

    const RepairAppointment = sequelize.define("RepairAppointment", {

        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false
        },

        created_date: DataTypes.DATE,

        appointment_date: DataTypes.DATE,

        status: DataTypes.STRING(20),

        customer_id: DataTypes.UUID

    }, {
        tableName: "repair_appointment",
        timestamps: false
    })

    return RepairAppointment
}