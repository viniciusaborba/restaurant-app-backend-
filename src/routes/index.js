const { Router } = require('express')
const userRoute = require('../routes/userRoutes/userRoutes')
const dishRoute = require('../routes/dishesRoutes/dishesRoutes')
const sessionRoutes = require('./sessionRoutes/sessionsRoutes')
const favoritesRoutes = require('./favoritesRoutes/favoritesRoutes')

const router = Router()

router.use("/users", userRoute)
router.use("/dishes", dishRoute)
router.use('/auth', sessionRoutes)
router.use('/favorites', favoritesRoutes)

module.exports = router