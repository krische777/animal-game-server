const { Router } = require('express')
const Room = require('./model')
const User = require('../user/model')

const router = new Router()

User.belongsTo(Room)
router.post('/room', 
(req, res, next)=>{
  const newRoom = {
    name: req.body.name,
    userId: User.id
  }
  Room.create(newRoom)
  .then(room => res.json(room))
  .catch(next)
})

module.exports = router