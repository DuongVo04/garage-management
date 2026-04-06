import { DataTypes } from "sequelize"

export default (sequelize) => {

    const RepairTicket = sequelize.define("RepairTicket", {

        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false
        },

        created_date: DataTypes.DATE,

        completed_date: DataTypes.DATEONLY,

        service_id: DataTypes.STRING(50),

		description: {
			type: DataTypes.STRING(500),
			allowNull: true,
			field: 'description'
		},

        appointment_id: DataTypes.STRING(50),

        customer_vehicle_id: DataTypes.STRING(50)

    }, {
        tableName: "repair_ticket",
        timestamps: false
    })

    return RepairTicket
}	