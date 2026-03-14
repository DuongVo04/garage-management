import { DataTypes, Deferrable } from "sequelize"

export default (sequelize) => {
    const Role = sequelize.define("Role", {

        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false
        },

        name: {
            type: DataTypes.STRING(20),
            unique: true
        },

        description: DataTypes.TEXT,

        is_deleted: DataTypes.TINYINT(1)


    }, {
        tableName: "role",
        timestamps: false
    })
    return Role;
}
