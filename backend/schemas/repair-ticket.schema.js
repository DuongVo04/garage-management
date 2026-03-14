import { DataTypes } from "sequelize"

export default (sequelize)=>{

    const RepairTicket = sequelize.define("RepairTicket",{

        id:{
            type:DataTypes.STRING(50),
            primaryKey:true
        },

        created_date:DataTypes.DATE,

        completed_date:DataTypes.DATE,

        service_id:DataTypes.STRING(50),

        appointment_id:DataTypes.STRING(50),

        customer_vehicle_id:DataTypes.STRING(50)

    },{
        tableName:"repair_ticket",
        timestamps:false
    })

    return RepairTicket
}