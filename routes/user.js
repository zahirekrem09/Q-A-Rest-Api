const express = require("express");

const { getSingleUser, getAllUsers } = require("../controllers/user");
const checkUserExist = require("../middlewares/db/checkUserExist");

const router = express.Router();

// /api/user
router.get("/", getAllUsers);
router.get("/:id", checkUserExist, getSingleUser);

module.exports = router;
