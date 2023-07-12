const { Router } = require('express')
const userRoute = require('../routes/userRoutes/userRoutes')

const router = Router()

router.use("/users", userRoute)

module.exports = router