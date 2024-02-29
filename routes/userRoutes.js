const express = require("express");
const {
  getAllUsers,
  getUser,
  deleteUser,
  updateUser,
  getAllEmployees,
  getAllDrivers,
  cancelCab,
} = require("../controllers/userController");
const { restrictTo, protect } = require("../middleware/authMiddleware.js");

const router = express.Router();

router.route("/employees").get(protect, restrictTo("admin"), getAllEmployees);
router.route("/drivers").get(protect, restrictTo("admin"), getAllDrivers);
router.route("/cancel-cab").patch(protect, cancelCab);

router.route("/").get(protect, restrictTo("admin"), getAllUsers);

router
  .route("/:id")
  .get(protect, restrictTo("admin"), getUser)
  .delete(protect, restrictTo("admin"), deleteUser)
  .patch(protect, restrictTo("admin"), updateUser);

module.exports = router;
