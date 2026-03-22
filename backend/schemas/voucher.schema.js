import { DataTypes } from "sequelize"

export default (sequelize) => {

    const Voucher = sequelize.define("Voucher", {

        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false
        },

        code: {
            type: DataTypes.STRING(20),
            unique: true
        },

        from: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },

        to: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },

        percent: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 0,
                max: 100
            }
        },

        event: DataTypes.STRING(255),

        is_available: {
            type: DataTypes.TINYINT(1),
            defaultValue: 1
        }

    }, {
        tableName: "voucher",
        timestamps: false
    })

    return Voucher
}