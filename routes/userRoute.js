const express = require('express');
const router = express.Router();
// const { signUpValidation, forgetValidation} = require('../helpers/validation')

const userController = require('../controller/userController')
router.post('/register',userController.userRegistration)
router.get('/getUser',userController.getUserById)
router.post('/getAllUser',userController.getAllUsers)
router.post('/updateUser',userController.updateUser)
router.post('/deleteUser',userController.deleteUser)

router.post('/forget-password',  userController.forgotpassword)
module.exports = router;