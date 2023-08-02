const { Router } = require('express')
const favoritesRoutes = Router()
const ensureAuthenticate = require('../../middlewares/ensureAuthenticate')

const FavoritesControllers = require('../../controllers/favoritesControllers')
const favoritesControllers = new FavoritesControllers

favoritesRoutes.use(ensureAuthenticate)

favoritesRoutes.post('/', favoritesControllers.create)
favoritesRoutes.get('/', favoritesControllers.index)
favoritesRoutes.delete('/:id', favoritesControllers.delete)

module.exports = favoritesRoutes