const getQueryParams = (req) => {
  const params = new URLSearchParams(req.url.split("?")[1]);
  const queryParams = {};
  for (const param of params) {
    queryParams[param[0]] = param[1];
  }
  return queryParams;
};

module.exports = { getQueryParams };
