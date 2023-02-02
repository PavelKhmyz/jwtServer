const Router = require('express').Router
const userController = require('../controllers/user')
const router = new Router()

router.post('/registration', userController.registration)
router.post('/login', userController.login)
router.post('/logout',  userController.logout)
router.post('/account', userController.addAccounts)
router.get('/refresh', userController.refresh)
router.get('/users', userController.getUsers)


module.exports = router
