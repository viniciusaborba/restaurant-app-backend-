const { Router } = require("express");
const cartRoutes = Router();

const CartController = require("../../controllers/cartController");
const ensureAuthenticate = require("../../middlewares/ensureAuthenticate");
const cartController = new CartController();

cartRoutes.use(ensureAuthenticate);

cartRoutes.post("/", cartController.create);
cartRoutes.get("/", cartController.index);
cartRoutes.get("/:id", cartController.show);
cartRoutes.delete("/:id", cartController.delete);
cartRoutes.get('/status', cartController.check)

module.exports = cartRoutes;
