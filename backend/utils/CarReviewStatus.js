const CAR_REVIEW_STATUS = Object.freeze({
    PENDING: "pending",     // User mới đặt, chờ admin duyệt
    CONFIRMED: "confirmed", // Admin đã chấp nhận
    REJECTED: "rejected",   // Admin từ chối
    DONE: "done",           // Đã xem xe xong
})

export default CAR_REVIEW_STATUS;