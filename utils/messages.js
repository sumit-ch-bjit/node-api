const success = (message, data = null) => {
  return JSON.stringify({
    success: true,
    message: message,
    data: data,
  });
};

const failure = (message, error = null) => {
  return JSON.stringify({
    success: false,
    message: message,
    error: error
  });
};

module.exports = { success, failure };
