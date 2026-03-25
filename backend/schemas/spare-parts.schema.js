import { DataTypes } from "sequelize"

export default (sequelize) => {

    const SpareParts = sequelize.define("SpareParts", {

        id: {
            type: DataTypes.UUID,
            type: DataTypes.STRING(50),
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },

        name: {
            type: DataTypes.STRING(100),
            unique: true
        },

        quantity_in_stock: DataTypes.INTEGER,

        unit_price: DataTypes.DECIMAL,

        unit_of_measure: DataTypes.STRING(100),

        image_path: DataTypes.STRING(255)

    }, {
        tableName: "spare_parts",
        timestamps: false
    })

    return SpareParts
}