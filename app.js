const express= require('express');
const app= express();
const cors = require("cors");
const dotenv = require('dotenv')
dotenv.config();
const userRouter = require('./routes/userRoute');
const webRouter = require('./routes/webRoute');
require("./model");
app.set('view engine','ejs');
app.set('views','./views');
const port= 8000;
var userCtrl = require('./controller/userController');
const bodyParser = require('body-parser');
app.use(express.json())
// app.get('/', (req,resp)=>{
//     resp.send('Home page')
// });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))
app.use(cors());
app.use('/api',userRouter);    
app.use('/',webRouter);   
app.post("/register", userCtrl.userRegistration);

app.post("/login", userCtrl.userLogin);
app.get("/mail-verification", userCtrl.verifymail);
app.post("/crud",userCtrl.crudOperation);


app.listen(port, ()=>{
    console.log(`App is listening at http://localhost:${port}`);
})