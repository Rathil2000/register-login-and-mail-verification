module.exports = (sequelize, DataTypes)=>{
    const password_resets = sequelize.define("password_reset",{
        email:{
            type:DataTypes.STRING,
        },
        token:{
            type:DataTypes.STRING,
        },
        created_at:{
            type:DataTypes.STRING
        }
    },{
        timestamps:false
    });
    return password_resets;
}