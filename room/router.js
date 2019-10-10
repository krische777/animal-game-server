const { Router } = require('express')
const Room = require('./model')
const User = require('../user/model')
const auth = require('../auth/middleware')
const router = new Router()

router.get('/room', auth,(req, res, next) => {
  Room.findAll({
    include: [
      { model: User}
    ]
  })
    .then(rooms => {
        res.json({ success: true, rooms });
        })
})

router.post('/room',auth,
  (req, res, next) => {
    const newRoom = {
      name: req.body.name,
      userId: User.id
    }
    Room.create(newRoom)
      .then(room => res.json(room))
      .catch(next)
  })

module.exports = router