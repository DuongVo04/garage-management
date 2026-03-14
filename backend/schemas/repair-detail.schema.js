import { DataTypes } from "sequelize"

export default (sequelize)=>{

    const RepairDetail = sequelize.define("RepairDetail",{

        id:{
            type:DataTypes.STRING(50),
            primaryKey:true
        },

        ticket_id:DataTypes.STRING(50),

        employee_id:DataTypes.STRING(50),

        usage_id:DataTypes.STRING(50),

        repair_date:DataTypes.DATE,

        note:DataTypes.STRING(100)

    },{
        tableName:"repair_detail",
        timestamps:false
    })

    return RepairDetail
}