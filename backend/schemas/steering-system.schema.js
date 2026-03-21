import { DataTypes } from "sequelize"

export default (sequelize)=>{

    const SteeringSystem = sequelize.define("SteeringSystem",{

        steering_system:{
            type:DataTypes.STRING(100),
            primaryKey:true
        },

        drivetrain:DataTypes.STRING(100),

        showroom_vehicle_id:DataTypes.STRING(50)

    },{
        tableName:"steering_system",
        timestamps:false
    })

    return SteeringSystem
}