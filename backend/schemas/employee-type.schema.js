import { DataTypes } from "sequelize"

export default (sequelize)=>{

    const EmployeeType = sequelize.define("EmployeeType",{

        id:{
            type:DataTypes.STRING(50),
            primaryKey:true
        },

        name:{
            type:DataTypes.STRING(20),
            allowNull:false
        }

    },{
        tableName:"employee_type",
        timestamps:false
    })

    return EmployeeType
}