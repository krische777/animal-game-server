const Sequelize = require('sequelize')
const sequelize = require('../db')
const User = require('../user/model')

const Game = sequelize.define('game', {
    firstPlayer: {
        type: Sequelize.INTEGER
    },
    secondPlayer: {
        type: Sequelize.INTEGER
    },
    healthp1: {
        type: Sequelize.INTEGER
    },
    healthp2: {
        type: Sequelize.INTEGER
    },
    turn: {
        type: Sequelize.STRING
    },
    winner: {
        type: Sequelize.STRING
    }
})
// User.belongsTo(Game)
Game.hasMany(User)

module.exports = Game