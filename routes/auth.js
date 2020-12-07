const express = require("express");
const {
  register,
  tokenTest,
  getUser,
  login,
  logout,
  imageUpload,
} = require("../controllers/auth");
const getAccessToRoute = require("../middlewares/auth/getAccessToRoute");
const profileImageUpload = require("../middlewares/auth/profileImageUpload");

const router = express.Router();
// /api/auth
router.post("/register", register);
router.post("/login", login);
router.get("/logout", getAccessToRoute, logout);
router.post(
  "/upload",
  [getAccessToRoute, profileImageUpload.single("profile_image")],
  imageUpload
);
router.get("/profile", getAccessToRoute, getUser);

module.exports = router;
