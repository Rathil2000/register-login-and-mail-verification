// const nodemailer = require('nodemailer');
// const Mailgen = require('mailgen');

var db = require('../model/index');
const randomstring = require('randomstring');
const jwt = require("jsonwebtoken")
const sendMail = require("../helpers/sendMail")
const bcrypt = require('bcryptjs');
const Users = db.user;
const password_resets = db.password_reset;


const userRegistration = async (req, res) => {
  const { firstName, lastName, email, password, password_confirmation } = req.body
  // console.log("body data ia:",email);
  if (password !== password_confirmation) {
    res.status(400).send({ "status": "failed", message: 'Password not match.' })
  }
  let isAvailable = await Users.findOne({ where: { email: email } })

  if (isAvailable) {
    res.status(400).send({ "status": "failed", message: "user already exits." })
  } else {
    let newUser = await Users.create({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,

    });


    let mailSubject = "Mail Verification";
    const randomToken = randomstring.generate();

    let content = '<p>Hii ' + req.body.firstName + ', \
  Please <a href="http://localhost:8000/mail-verification?token='+ randomToken + '"> Verify</a> your Mail.';
    sendMail(req.body.email, mailSubject, content);

    var token = { token: randomToken }

    const result = await Users.update(token, { where: { email: req.body.email } });

    if (result) {
      return res.status(201).json({ sucess: "success", data: result, messgae: "register successfully" });
    }
    else {
      return res.status(500).json({ sucess: "failed", message: "somthing went wrong!!!" })
    }
  }




}



const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await Users.findOne({ where: { email: email } })

    if (user !== null) {

      //const isMatch = await bcrypt.compare(password, user.password)
      const ismatch = password == user.password

      if (ismatch == true) {
        // Generate JWT Token
        res.send({ "status": "failed", "message": "Email or Password is not Valid" });

      } else {
        // console.log("secret key is:",process.env.SECRET_KEY);
        const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, { expiresIn: '5d' })
        res.send({ "status": "success", "message": "Login Success", "token": token })

      }
    } else {
      res.send({ "status": "failed", "message": "You are not a Registered User" })
    }

  } catch (error) {
    console.log(error)
    res.send({ "status": "failed", "message": "Unable to Login" })
  }
}

const verifymail = async (req, res) => {
  var token = req.query.token;

  const data = await Users.findOne({
    where: {
      token: token
    }
  })
  console.log(data);
  if (data) {
    var token = { token: 'null' }
    const result = await Users.update(token, { where: { Id: data.id } })
    return res.render('mail-verification', { message: 'email verify sucessfully..' });
  } else {
    return res.render('404')
  }
}

const getUserById = async (req, res) => {

  let data = await Users.findOne({ where: { id: req.body.id } })

  let response = {
    data: data
  }
  res.status(200).json(response)
}

const getAllUsers = async (req, res) => {

  let data = await Users.findAll({})
  let response = {
    data: data
  }
  res.status(200).json(response)

}

const updateUser = async (req, res) => {

  let data = await Users.update({ firstName: req.body.firstName, lastName: req.body.lastName, email: req.body.email }, {
    where: {
      id: req.body.id
    }
  })

  let response = {
    data: data
  }
  res.status(200).json(response)

}

const deleteUser = async (req,res)=>{

  let data= await Users.destroy({
    where:{
      id:req.body.id
    }
  })
  let response = {
    data: data
  }
  res.status(200).json(response)


}
const forgotpassword = async (req, res) => {
  try {
    const { email } = req.body;
    console.log(email);
    // const {error} = schemaauth.forgetpassword.validate(req.body);

    var data = await Users.findOne({ where: { email: email } })
    if (data) {
      let email = data.email;
      let mailsubject = 'forget password';
      let token = randomstring.generate();
      console.log("main token is:", token);
      let content = '<p> heyy, ' + data.firstName + '\
    please <a href = "http://localhost:8000/reset-password?token='+ token + '"> Click Here </a> To Reset Password';
      sendMail(email, mailsubject, content)
      const deleteuser = await password_resets.destroy({ where: { email: email } })
      const result = await password_resets.create({ email, token })

      res.status(200).send({ sucess: "true", message: "mail send successfully for reset password..." })
    }
    else {
      res.status(401).send({ sucess: "false", message: "email does not exist" })
    }

  } catch (error) {
    console.log(error);
    res.json({ message: "something wrong" })
  }
}


const resetpassword = async (req, res) => {
  try {
    var token = req.query.token;
    if (token) {     //check token is or not
      const result = await password_resets.findOne({ where: { token: token } })

      let resultLength = 0;
      resultLength = Object.keys(result).length;
      console.log("email is ", result.email);
      if (resultLength > 0) {                //if token exist than find from that and check that token is correct or not
        const data = await password_resets.findOne({ where: { email: result.email } })
        res.render('reset-password', { user: data })
      } else {
        res.status(400).render('404')
      }
    } else {
      res.render('404')
    }

  } catch (error) {
    console.log(error);
  }
}

const resetpassworduser = async (req, res) => {
  if (req.body.password != req.body.confirm_password) {
    res.render('reset-password', { error_message: "Password Not Match..", user: { id: req.body.user_id, email: req.body.email } })   //pass user value 
  } else {
    // const password = bcrypt.hash(req.body.confirm_password,10,async (err,hash)=>{
    // if (err){
    //   console.log(err);
    // }
    //const tokendelete = await password_resets.destroy({where:{email:req.body.email}})  //delete token from password_reset
    try {
      const hashpassword = await bcrypt.hash(req.body.confirm_password, 10);
      //var password = req.body.confirm_Password
      const email = req.body.email;
      console.log(email);
      const userupdate = await Users.update({ password: hashpassword }, { where: { email: email } })  //set new password in user table

      if (userupdate == true) {
        res.render('message', { message: 'password reset successfully..' })
      } else {
        res.render('message', { message: 'somthing went wrong..' })
      }
    }
    catch (error) {
      console.error("Error:", error);
      res.render('message', { message: 'An error occurred.' });
    }
  }
}

var crudOperation = async (req, res) => {
 
  // truncate

  // let data = await Users.destroy({
  //   truncate:true
  // })


  // bulk create

  // let data = await Users.bulkCreate([
  //   {firstName:"demo1",email:"demo1@gmail.com"},
  //   {firstName:"demo2",email:"demo2@gmail.com"},
  //   {firstName:"demo3",email:"demo3@gmail.com"},
  //   {firstName:"demo4",email:"demo4@gmail.com"},
  //   {firstName:"demo5",email:"demo5@gmail.com"},
  // ])

  let response = {
    data: data
  }
  res.status(200).json(response)
}


module.exports = {

  userRegistration,
  userLogin,
  verifymail,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
  resetpassworduser,
  resetpassword,
  forgotpassword,
  crudOperation
}
