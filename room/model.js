const Sequelize=require('sequelize')
const sequelize=require('../db')
const User = require('../user/model')

const Room = sequelize.define('room', {
  name: {
    type: Sequelize.STRING,
    unique:true
  },
  status: {
    type: Sequelize.STRING, 
  },
  player1: {
    type:Sequelize.STRING
  },
  player2: {
    type:Sequelize.STRING
  }
})
User.belongsTo(Room)
Room.hasMany(User)
 
module.exports = Room