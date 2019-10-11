const {Router} = require('express')
const Room = require('./model')
const User = require('../user/model')
const Game = require('../game/model')
const auth = require('../auth/middleware')
const router = new Router()
const Sse = require('json-sse')


const stream = new Sse()


router.get('/room', async (req, res) => {
    console.log('got a request on lobby')
    const room = await Room.findAll()
    const data = JSON.stringify(room)
    console.log('data in this lobby is', data)
    //res.send(room)

    stream.updateInit(createEvent(data, 'ROOM_FIND_ALL'))
    stream.init(req, res)
})

function createEvent(data, eventType) {
    return {"data": data, type: eventType}
}

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
        const room = await Room.findAll()
        const data = JSON.stringify(room)
        console.log('data in this lobby after post', data)
        res.status(200)
        //stream.send(room)
        stream.send(createEvent(JSON.stringify(room), 'ROOM_UPDATED'))
    })

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max + 1));
}

router.put('/room', auth,
    async (req, res, next) => {
        const room = await Room.findOne({
            where: {
                name: req.body.roomName
            }
        })
        if (room) {
            if (room.status === "EMPTY") {
                await Room.update({
                    status: "WAITING",
                    player1: req.body.userId
                }, {where: {name: req.body.roomName}})
                res.status(200)
                const rooms = await Room.findAll()
                const data = JSON.stringify(rooms)
                stream.send(createEvent(data, 'ROOM_UPDATED'))

                let player1 = parseInt(req.body.userId);
                const game = await Game.create({
                    healthp1: 200,
                    healthp2: -1,
                    firstPlayer: player1,
                    turn: player1,
                })
                stream.send({"data": game, type: 'GAME_CREATED'})
            } else if (room.status === "WAITING") {
                const player1 = room.player1;
                const player2 = req.body.userId;
                await Room.update({
                    status: "FULL",
                    player2: player2,
                }, {where: {name: req.body.roomName}})
                res.status(200)
                const rooms = await Room.findAll()
                const data = JSON.stringify(rooms)
                stream.send(createEvent(data, 'ROOM_UPDATED'))

                const random = getRandomInt(1);
                const playerInTurn = random === 0 ? player1 : player2;
                const game = await Game.create({
                    healthp1: 200,
                    healthp2: 200,
                    firstPlayer: parseInt(player1),
                    secondPlayer: player2,
                    turn: playerInTurn,
                    winner: req.body.winner
                })
                stream.send({"data": game, type: 'GAME_CREATED'})

            } else {
                res.status(400)
                res.send("Room is full cannot Join")
            }
        } else {
            res.status(400)
            res.send("No room found")
        }
    }
)

module.exports = router