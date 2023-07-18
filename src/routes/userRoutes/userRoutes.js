const { Router } = require('express')
const userRoutes = Router()
const ensureAuthenticate = require('../../middlewares/ensureAuthenticate')

const UserController = require('../../controllers/userControllers')
const userController = new UserController

userRoutes.post('/', userController.create)
userRoutes.delete('/', ensureAuthenticate, userController.delete)
userRoutes.get('/', ensureAuthenticate, userController.index)
userRoutes.put('/', ensureAuthenticate, userController.update)

module.exports = userRoutes