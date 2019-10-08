 
const Sequelize=require('sequelize')

const sequelize=require('../db')

const Room = sequelize.define('room', {
  name: {
    type: Sequelize.STRING
  },
  userId: {
    type: Sequelize.INTEGER
  },
  status: {
    type: Sequelize.STRING, 
  },
})

module.exports = Room