const express = require("express");
const {
  register,
  tokenTest,
  getUser,
  login,
  logout,
} = require("../controllers/auth");
const { getAccessToRoute } = require("../middlewares/auth");

const router = express.Router();
// /api/auth
router.post("/register", register);
router.post("/login", login);
router.get("/logout", getAccessToRoute, logout);
router.get("/profile", getAccessToRoute, getUser);

module.exports = router;
