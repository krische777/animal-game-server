const { Router } = require('express')
const User = require('./model')
const bcrypt = require('bcrypt')

const router = new Router()

router.post('/signup', (req, res, next) => {
  //console.log(req.body)
  const user = {
    firstName: req.body.firstName,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10)
  }

  User.count({ where: { email: req.body.email } })
    .then(count => {
      if (count != 0) {
        console.log("user exists")
        res.status(400).send('User with that email already exists');
      } else {
        console.log("user does not exist, saving")
        res.status(200);
        User.create(user)
          .then(user => res.json(user))
          .catch(next)
      }
    })

})

module.exports = router