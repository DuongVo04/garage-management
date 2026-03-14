import { DataTypes } from "sequelize"

export default (sequelize)=>{

    const ShowroomVehicleImage = sequelize.define("ShowroomVehicleImage",{

        id:{
            type:DataTypes.STRING(50),
            primaryKey:true
        },

        description:DataTypes.STRING(50),

        image_path:DataTypes.STRING(255),

        showroom_vehicle_id:DataTypes.STRING(50)

    },{
        tableName:"showroom_vehicle_image",
        timestamps:false
    })

    return ShowroomVehicleImage
}