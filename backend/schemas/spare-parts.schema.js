import { DataTypes } from "sequelize"

export default (sequelize)=>{

    const SpareParts = sequelize.define("SpareParts",{

        id:{
            type:DataTypes.STRING(50),
            primaryKey:true
        },

        spare_parts_name:DataTypes.STRING(50),

        quantity_in_stock:DataTypes.INTEGER,

        unit_price:DataTypes.DECIMAL,

        unit_of_measure:DataTypes.STRING(100),

        image:DataTypes.STRING(255)

    },{
        tableName:"spare_parts",
        timestamps:false
    })

    return SpareParts
}