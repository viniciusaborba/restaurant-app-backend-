const { Router } = require("express");
const userRoutes = Router();
const ensureAuthenticate = require("../../middlewares/ensureAuthenticate");
const uploadConfig = require("../../configs/upload");
const multer = require("multer");
const upload = multer(uploadConfig.MULTER);

const UserController = require("../../controllers/userControllers");
const userController = new UserController();

userRoutes.post("/", userController.create);
userRoutes.delete("/", ensureAuthenticate, userController.delete);
userRoutes.get("/", ensureAuthenticate, userController.index);
userRoutes.put(
  "/",
  upload.single("avatar"),
  ensureAuthenticate,
  userController.update
);

module.exports = userRoutes;
