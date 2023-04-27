'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const data = (data) => ({
  err: null,
  data: Array.isArray(data) ? data : [data]
});
const error = (err) => ({
  err,
  data: null
});
const paginationData = (data, meta) => ({
  err: null,
  data,
  meta
});
const response = (res, type, result, message = '', code = 200) => {
  let status = true;
  let data = result.data || result;
  let meta = result.meta;
  if (type === 'fail') {
    status = false;
    data = [];
    message = message || result.message || 'An error occurred';
    code = code || result.code || 500;
  }
  res.status(code).json({
    success: status,
    data,
    meta,
    message,
    code
  });
};
const errorResponse = (res, result, message = '', code = 500) => {
  let status = false;
  let data = result ? result.message : null;
  res.status(code).json({
    success: status,
    data,
    message,
    code
  });
};
const paginationResponse = (res, type, result, message = '', code = 200) => {
  let status = true;
  let data = result.data;
  if (type === 'fail') {
    status = false;
    data = [];
    message = result.message || message;
  }
  res.status(code).json({
    success: status,
    data,
    meta: result.meta,
    message,
    code
  });
};
exports.default = { data, error, response, errorResponse, paginationResponse, paginationData };
//# sourceMappingURL=wrapper.js.map
