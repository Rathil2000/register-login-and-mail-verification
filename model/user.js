module.exports = (sequelize, DataTypes) => {
    const Users = sequelize.define("user", {
        firstName: {
            type: DataTypes.STRING,
        },
        lastName: {
            type: DataTypes.STRING,
        },
        email: {
            type: DataTypes.STRING,

        },
        password:{
            type: DataTypes.STRING,
        },
        token:{
            type:DataTypes.STRING,
        }
     
    }, {
        timestamps: false
    });
    return Users;
}