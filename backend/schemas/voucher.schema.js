import { DataTypes } from "sequelize"

export default (sequelize) => {

    const Voucher = sequelize.define("Voucher", {

        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false
        },

        voucher_code: {
            type: DataTypes.STRING(10),
            unique: true
        },

        discount_date: DataTypes.DATE,

        percent: DataTypes.INTEGER,

        event: DataTypes.STRING(255),

        is_available: DataTypes.TINYINT(1),

    }, {
        tableName: "voucher",
        timestamps: false
    })

    return Voucher
}