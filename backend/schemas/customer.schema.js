import { DataTypes } from "sequelize"

export default (sequelize) => {

    const Customer = sequelize.define("Customer", {

        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false
        },

        full_name: {
            type: DataTypes.STRING(50)
        },

        phone_number: {
            type: DataTypes.STRING(10),
            unique: true
        },

        email: {
            type: DataTypes.STRING(100)
        },

        address: {
            type: DataTypes.STRING(200)
        },

        account_id: {
            type: DataTypes.STRING(50),
            allowNull: true,
            defaultValue: null
        }

    }, {
        tableName: "customer",
        timestamps: false
    })
    return Customer;
}