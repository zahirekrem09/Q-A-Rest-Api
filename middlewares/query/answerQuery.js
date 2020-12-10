const asyncErrorWrapper = require("express-async-handler");
const { populateHelper, paginationHelper } = require("./queryHelpers");

const answerQuery = function (model, options) {
  return asyncErrorWrapper(async function (req, res, next) {
    //question id;

    const { id } = req.params;
    // pagination
    const arrayName = "answers";

    const total = (await model.findById(id))["answerCount"];
    const paginationResult = await paginationHelper(total, undefined, req);
    const startIndex = paginationResult.startIndex;
    const limit = paginationResult.limit;

    // arrayı parcalamaya calıskez skip kullanılmıyor.
    let queryObject = {};
    queryObject[arrayName] = { $slice: [startIndex, limit] };
    let query = model.find({ _id: id }, queryObject);

    query = populateHelper(query, options.population);

    const queryResults = await query;
    res.queryResults = {
      success: true,
      count: queryResults.length,
      pagination: paginationResult.pagination,
      data: queryResults,
    };
    // console.log(total);

    //populate

    next();
  });
};

module.exports = answerQuery;
