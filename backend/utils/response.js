export const response = (
    res,
    success,
    message,
    status,
    data = null,
    errors = null
) => {
    return res.status(status).json({
        success,
        message,
        data,
        errors,
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