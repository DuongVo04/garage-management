import { DataTypes } from "sequelize"

export default (sequelize) => {

    const Account = sequelize.define("Account", {

        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false
        },

        username: {
            type: DataTypes.STRING(100),
            unique: true
        },

        password: {
            type: DataTypes.STRING(100)
        },

        is_activated: {
            type: DataTypes.TINYINT(1)
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