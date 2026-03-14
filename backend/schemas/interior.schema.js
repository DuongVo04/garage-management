import { DataTypes } from "sequelize"

export default (sequelize)=>{

    const Interior = sequelize.define("Interior",{

        seat_count:{
            type:DataTypes.INTEGER,
            primaryKey:true
        },

        is_androidauto_applecarplay:DataTypes.BOOLEAN,

        showroom_vehicle_id:DataTypes.STRING(50)

    },{
        tableName:"interior",
        timestamps:false
    })

    return Interior
}