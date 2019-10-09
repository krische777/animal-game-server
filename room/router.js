const { Router } = require('express')
const Room = require('./model')
const User = require('../user/model')
const auth = require('../auth/middleware')
const router = new Router()
const Sse=require('json-sse')


const stream=new Sse()

router.get('/room',  async(req, res)=>{
  console.log('got a request on lobby')
  const room=await Room.findAll()
  const data=JSON.stringify(room)
  console.log('data in this lobby is', data)
  //res.send(room)

  stream.updateInit(data)
  stream.init(req, res)
})

// router.get('/room', (req, res, next) => {
//   Room.findAll({
//     include: [
//       { model: User}
//     ]
//   })
//     .then(result => {
//       console.log("rest", result)
//       stream.updateInit()
//     })
// })


router.post('/room', auth,
  async (req, res, next) => {
    const newRoom = {
      name: req.body.name,
      userId: User.id
    }
    await Room.create(newRoom)
    const room=await Room.findAll()
    const data=JSON.stringify(room)
    console.log('data in this lobby after post', data)
    res.status(200)
    res.send("room added")
    //stream.send(room)
    stream.send(data)
  })

module.exports = router