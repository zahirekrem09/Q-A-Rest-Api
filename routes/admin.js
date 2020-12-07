const express = require("express");
const getAccessToRoute = require("../middlewares/auth/getAccessToRoute");
const getAdminAccess = require("../middlewares/auth/getAdminAccess");
const { blockUser } = require("../controllers/admin");
const checkUserExist = require("../middlewares/db/checkUserExist");
const router = express.Router();

// /api/admin
router.use([getAccessToRoute, getAdminAccess]);

router.get("/block/:id", checkUserExist, blockUser);
// router.get("/", (req, res, next) => {
//   res.status(200).json({
//     success: true,
//     message: "Admin Page",
//   });
// });

module.exports = router;
