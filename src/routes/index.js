const { Router } = require('express')
const userRoute = require('../routes/userRoutes/userRoutes')
const dishRoute = require('../routes/dishesRoutes/dishesRoutes')

const router = Router()

router.use("/users", userRoute)
router.use("/dishes", dishRoute)


module.exports = router