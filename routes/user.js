const express = require("express");

const { getSingleUser } = require("../controllers/user");

const router = express.Router();

// /api/user

module.exports = router;

router.get("/:id", getSingleUser);
