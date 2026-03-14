import { DataTypes } from "sequelize"

export default (sequelize)=>{

    const RepairAppointment = sequelize.define("RepairAppointment",{

        id:{
            type:DataTypes.STRING(50),
            primaryKey:true
        },

        created_date:DataTypes.DATE,

        appointment_date:DataTypes.DATE,

        customer_id:DataTypes.STRING(50)

    },{
        tableName:"repair_appointment",
        timestamps:false
    })

    return RepairAppointment
}