const {DataTypes} = require('sequelize')

module.exports = (sequelize)=>{
    sequelize.define('Post',{
        id:{
            allowNull:false,
            autoIncrement:true,
            primaryKey:true,
            type: DataTypes.INTEGER
        },
        text:{
            type: DataTypes.TEXT,
            allowNull:false
        },
        date:{
            type: DataTypes.DATE,
            allowNull:false
        },
    },
    {
        paranoid:true,
    })
}