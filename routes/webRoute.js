const express = require("express");
const user_route = express();


user_route.set('view engine','ejs');
user_route.set('views','./views');
user_route.use(express.static('public'));

const userController = require("../controller/userController")

user_route.get('/mail-verification', userController.verifymail);
user_route.post('/login-user,', userController.userLogin);
user_route.get('/reset-password',userController.resetpassword);
user_route.post('/reset-password',userController.resetpassworduser);

module.exports = user_route;