import { DataTypes } from "sequelize";


export default (sequelize) => {
    const CarReviewAppointment = sequelize.define("CarReviewAppointment", {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false
        },
        viewer_name: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        phone_number: {
            type: DataTypes.STRING(11),
            allowNull: false,
        },
        view_at: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        status: {
            type: DataTypes.STRING(10),
            allowNull: false,
        },
        showroom_vehicle_id: {
            type: DataTypes.STRING(50),
            allowNull: false,
        }
    }, {
        tableName: "car_review_appointment",
        timestamps: false
    });
    return CarReviewAppointment
}
