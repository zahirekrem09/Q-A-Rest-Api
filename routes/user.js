const express = require("express");
const userQuery = require("../middlewares/query/userQuery");
const User = require("../models/User");
const { getSingleUser, getAllUsers } = require("../controllers/user");
const checkUserExist = require("../middlewares/db/checkUserExist");

const router = express.Router();

// /api/user
router.get("/", userQuery(User), getAllUsers);
router.get("/:id", checkUserExist, getSingleUser);

module.exports = router;
