const { Router } = require('express')
const userRoutes = Router()

const UserController = require('../../controllers/userControllers')
const userController = new UserController

userRoutes.post('/', userController.create)
userRoutes.delete('/:id', userController.delete)
userRoutes.get('/', userController.index)
userRoutes.put('/:id', userController.update)

module.exports = userRoutes