import { DataTypes } from "sequelize"
import sequelize from "../database-connection.js"

export default (sequelize) => {

    const SpareParts = sequelize.define("SpareParts", {

        id: {
            type: DataTypes.STRING(50),
            primaryKey: true
        },

        name: {
            type: DataTypes.STRING(20),
            unique: true
        }

    }, {
        tableName: "role",
        timestamps: false
    })
    return SpareParts
}
