const {Sequelize,DataTypes} =require("sequelize");

const sequelize = new Sequelize('my-node','root','',{
    host:'localhost',
    dialect:'mysql',
    pool:{max:5,min:0,idle:10000}

});

sequelize.authenticate()
.then(()=>{
    console.log("connected");
})
.catch(err=>{
    console.log("Error"+err);
})

const db = {};
db.Sequelize=Sequelize;
db.sequelize=sequelize;

db.user = require('./user.js')(sequelize,DataTypes);
db.password_reset = require('./password_reset.js')(sequelize,DataTypes);
db.sequelize.sync({force:false})
.then(()=>{
    console.log("yes re-sync");
})
module.exports = db;