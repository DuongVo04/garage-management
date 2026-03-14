import { DataTypes } from "sequelize"

export default (sequelize) => {

    const Account = sequelize.define("Account", {

        id: {
            type: DataTypes.STRING(50),
            primaryKey: true
        },

        user_name: {
            type: DataTypes.STRING(100),
            unique: true
        },

        password: {
            type: DataTypes.STRING(100)
        },

        role_id: {
            type: DataTypes.STRING(50)
        }

    }, {
        tableName: "account",
        timestamps: false
    })

    return Account;
}