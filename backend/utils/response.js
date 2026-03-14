export const successResponse = (res, message, data = null, status = 200) => {
    return res.status(status).json({
        success: true,
        message,
        data,
        errors: null,
        timestamp: new Date()
    });
};

export const paginationResponse = (
    res,
    message,
    items,
    page,
    limit,
    totalItems
) => {

    const totalPages = Math.ceil(totalItems / limit);

    return res.json({
        success: true,
        message,
        data: {
            items,
            pagination: {
                page,
                limit,
                totalItems,
                totalPages
            }
        },
        errors: null,
        timestamp: new Date()
    });
};

export const errorResponse = (res, message, errors = null, status = 500) => {
    return res.status(status).json({
        success: false,
        message,
        data: null,
        errors,
        timestamp: new Date()
    });
};