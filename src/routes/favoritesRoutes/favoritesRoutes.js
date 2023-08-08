const { Router } = require("express");
const favoritesRoutes = Router();
const ensureAuthenticate = require("../../middlewares/ensureAuthenticate");

const FavoritesControllers = require("../../controllers/favoritesControllers");
const favoritesControllers = new FavoritesControllers();

favoritesRoutes.use(ensureAuthenticate);

favoritesRoutes.post("/", favoritesControllers.create);
favoritesRoutes.get("/", favoritesControllers.index);
favoritesRoutes.delete("/", favoritesControllers.delete);
favoritesRoutes.get("/status", favoritesControllers.check);

module.exports = favoritesRoutes;
