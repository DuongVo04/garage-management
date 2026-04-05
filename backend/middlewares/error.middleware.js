export const errorHandler = (err, req, res, next) => {

    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error",
        data: null,
        error: err.errors?.error || err.errors || null,
        errors: err.errors || null,
        timestamp: new Date()
    });
};