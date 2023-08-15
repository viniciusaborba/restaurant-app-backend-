const { Router } = require("express");
const userRoute = require("../routes/userRoutes/userRoutes");
const dishRoute = require("../routes/dishesRoutes/dishesRoutes");
const sessionRoutes = require("./sessionRoutes/sessionsRoutes");
const favoritesRoutes = require("./favoritesRoutes/favoritesRoutes");
const cartRoutes = require("./cartRoutes");

const router = Router();

router.use("/users", userRoute);
router.use("/dishes", dishRoute);
router.use("/auth", sessionRoutes);
router.use("/favorites", favoritesRoutes);
router.use("/cart", cartRoutes);

module.exports = router;
