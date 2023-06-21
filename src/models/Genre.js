const {DataTypes} = require ('sequelize')

module.exports = (sequelize) =>{
    sequelize.define('Genre', {
        id:{
            allowNull:false,
            autoIncrement:true,
            primaryKey:true,
            type: DataTypes.INTEGER
        },
        name:{
            type:DataTypes.STRING,
            allowNull:false,
        },
    },
    {
        paranoid:true,
        timestamps:false
    }
    )
}

