const { Router } = require('express')
const userRoute = require('../routes/userRoutes/userRoutes')
const dishRoute = require('../routes/dishesRoutes/dishesRoutes')
const sessionRoutes = require('./sessionRoutes/sessionsRoutes')

const router = Router()

router.use("/users", userRoute)
router.use("/dishes", dishRoute)
router.use('/auth', sessionRoutes)

module.exports = router