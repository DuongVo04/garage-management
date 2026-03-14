import { DataTypes } from "sequelize"

export default (sequelize)=>{

    const CarReturnAppointment = sequelize.define("CarReturnAppointment",{

        id:{
            type:DataTypes.STRING(50),
            primaryKey:true
        },

        created_date:DataTypes.DATE,

        return_date:DataTypes.DATE,

        repair_ticket_id:DataTypes.STRING(50)

    },{
        tableName:"car_return_appointment",
        timestamps:false
    })

    return CarReturnAppointment
}