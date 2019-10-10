const { Router } = require('express')
const Game = require('./model')
const Sse = require('json-sse')
const User = require('../user/model')

const stream = new Sse()
const router = new Router()

router.get('/game', //auth,
  async (req, res, next) => {
    const game = await Game.findAll({
      include: [
        { model: User}
      ]
    })
    const data = JSON.stringify(game)
    res.send(game)
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

router.put('/game/:id',
  (req, res, next) => {
    const id = req.params.id
    Game.findByPk(id)
      .then(game => {
        game.update({healthp1: game.healthp1-20})
      })
      .then(game => res.send(game))
      .catch(next)
  })

module.exports = router