const express = require("express");
const {
  getAllRoutes,
  createRoute,
  getRoute,
  deleteRoute,
  updateRoute,
  getRosteredPassenger,
  pendingPassengers,
  getRouteByDriver,
  getAllNonActiveRoutes,
  getEmployeeRoute,
  cancelCab,
} = require("../controllers/routesController");
const { restrictTo, protect } = require("../middleware/authMiddleware.js");

const router = express.Router();

router
  .route("/rosteredPassengers")
  .get(protect, restrictTo("admin"), getRosteredPassenger);
router
  .route("/pendingPassengers")
  .get(protect, restrictTo("admin"), pendingPassengers);
router
  .route("/driverRoute/:did")
  .get(protect, restrictTo("admin", "driver"), getRouteByDriver);

router.route("/employeeRoute/:eid").get(protect, getEmployeeRoute);

router
  .route("/")
  .get(protect, restrictTo("admin"), getAllRoutes)
  .post(protect, restrictTo("admin"), createRoute);

router
  .route("/nonActive")
  .get(protect, restrictTo("admin"), getAllNonActiveRoutes);

router
  .route("/:id")
  .get(protect, restrictTo("admin"), getRoute)
  .delete(protect, restrictTo("admin"), deleteRoute)
  .patch(protect, restrictTo("admin", "driver"), updateRoute);

module.exports = router;
