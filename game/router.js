const {Router} = require('express')
const Game = require('./model')
const Sse = require('json-sse')
const User = require('../user/model')

const stream = new Sse()
const router = new Router()

router.get('/game', //auth,
    async (req, res, next) => {
        const game = await Game.findAll({
            include: [
                {model: User}
            ]
        })
        const data = JSON.stringify(game)
        stream.updateInit(data)
        stream.init(req, res)
    })

router.post('/game',
    async (req, res, next) => {
        const game1 = {
            name: req.body.name,
            healthp1: 200,
            healthp2: 200,
            turn: req.body.turn,
            winner: req.body.winner
        }
        await Game.create(game1)
        const game = await Game.findAll()
        const data = JSON.stringify(game)
        stream.send(data)
        res.status(200)
        res.send('Game created')
    })

router.put('/game/fight',
    async (req, res, next) => {
      console.log('/game/fight', req.body)
        const id = req.body.gameId
        const game = await Game.findByPk(id)
        console.log('/game/flight game:', game)
        if (game) {
            if (req.body.fightAction === "Attack") {
                if (game.firstPlayer === parseInt(req.body.userId)) {
                    const player1Health = game.healthp1;
                    await Game.update({healthp1: player1Health - 20}, {where: {id: req.body.gameId}})
                    const updated = await Game.findByPk(id)
                    const data = JSON.stringify(updated)
                    console.log('sending back game', data)
                    res.status(200)
                    stream.send({"data": data, type: 'GAME_PLAYER_ATACKED'})

                } else if (game.secondPlayer === parseInt(req.body.userId)) {
                    const player2Health = game.healthp2;
                    await Game.update({healthp2: player2Health - 20}, {where: {id: req.body.gameId}})
                    const updated = await Game.findByPk(id)
                    const data = JSON.stringify(updated)
                    console.log('sending back game', data)
                    res.status(200)
                    stream.send({"data": data, type: 'GAME_PLAYER_ATTACKED'})

                }
            }

        }
    })

module.exports = router