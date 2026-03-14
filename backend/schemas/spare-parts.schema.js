import { DataTypes } from "sequelize"
import sequelize from "../database-connection.js"

export default (sequelize) => {

    const SpareParts = sequelize.define("SpareParts", {

        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false
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
