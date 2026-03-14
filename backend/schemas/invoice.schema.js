import { DataTypes } from "sequelize"

export default (sequelize)=>{

    const Invoice = sequelize.define("Invoice",{

        id:{
            type:DataTypes.STRING(50),
            primaryKey:true
        },

        created_date:DataTypes.DATE,

        total_cost:DataTypes.DECIMAL(20,0),

        payment_method:DataTypes.STRING(20),

        discount_id:DataTypes.STRING(50),

        ticket_id:DataTypes.STRING(50)

    },{
        tableName:"invoice",
        timestamps:false
    })

    return Invoice
}