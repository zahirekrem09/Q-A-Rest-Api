const asyncErrorWrapper = require("express-async-handler");
const { searchHelper, paginationHelper } = require("./queryHelpers");

const userQuery = function (model, options) {
  return asyncErrorWrapper(async function (req, res, next) {
    // initial query;
    let query = model.find();
    //Search
    query = searchHelper("name", query, req);
    // pagination
    const total = await model.countDocuments();
    const paginationResult = await paginationHelper(total, query, req);
    query = paginationResult.query;
    const pagination = paginationResult.pagination;

    const queryResults = await query;

    res.queryResults = {
      success: true,
      count: queryResults.length,
      pagination: pagination,
      data: queryResults,
    };

    next();
  });
};

module.exports = userQuery;
