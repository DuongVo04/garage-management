import { DataTypes } from "sequelize"

export default (sequelize) => {

    const RepairDetail = sequelize.define("RepairDetail", {

        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false
        },

        ticket_id: DataTypes.STRING(50),

        employee_id: DataTypes.STRING(50),

        usage_id: DataTypes.STRING(50),

        repair_date: DataTypes.DATEONLY,

        note: DataTypes.STRING(100)

    }, {
        tableName: "repair_detail",
        timestamps: false
    })

    return RepairDetail
}