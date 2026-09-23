function notFound(req, res, next) { res.status(404); next(new Error(`Route not found: ${req.originalUrl}`)); }
function errorHandler(err, req, res, next) {
  let status = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  let message = err.message || 'Something went wrong.';
  if (err.name === 'ValidationError') { status = 400; message = Object.values(err.errors).map(e => e.message).join(', '); }
  if (err.code === 11000) { status = 409; message = 'An account with this email already exists.'; }
  if (err.name === 'CastError') { status = 404; message = 'Record not found.'; }
  res.status(status).json({ message, ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {}) });
}
module.exports = { notFound, errorHandler };
