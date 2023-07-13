const { Router } = require('express')
const dishesRoutes = Router()

const DishesControllers = require('../../controllers/dishesControllers')
const dishesControllers = new DishesControllers

dishesRoutes.post('/', dishesControllers.create)
dishesRoutes.delete('/:id', dishesControllers.delete)
dishesRoutes.put('/:id', dishesControllers.update)
dishesRoutes.get('/', dishesControllers.index)
dishesRoutes.get('/:id', dishesControllers.show)

module.exports = dishesRoutes