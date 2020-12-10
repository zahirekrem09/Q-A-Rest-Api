const asyncErrorWrapper = require("express-async-handler");
const { searchHelper, paginationHelper } = require("./queryHelpers");

const answerQuery = function (model, options) {
  return asyncErrorWrapper(async function (req, res, next) {
    //question id;

    const { id } = req.params;

    const arrayName = "answers";

    const total = (await model.findById(id))["answerCount"];
    const paginationResult = await paginationHelper(total, undefined, req);
    const startIndex = paginationResult.startIndex;
    const limit = paginationResult.limit;

    // arrayı parcalamaya calıskez skip kullanılmıyor.
    let queryObject = {};
    queryObject[arrayName] = { $slice: [startIndex, limit] };
    let query = await model.find({ _id: id }, queryObject);

    const queryResults = await query;
    res.queryResults = {
      success: true,
      count: queryResults.length,
      pagination: paginationResult.pagination,
      data: queryResults,
    };
    // console.log(total);

    next();
  });
};

module.exports = answerQuery;
