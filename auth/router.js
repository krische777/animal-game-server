const {Router} =require('express')
const {toJWT, toData}=require('./jwt')
const auth=require('./middleware')
const User=require('../user/model')
const bcrypt = require('bcrypt')

const router=new Router()

router.post('/login', (req, res, next)=>{
    console.log('login', req.body)
    const email=req.body.email
    const password=req.body.password
       if(email==null||password==null||
        !email||!password) {
        res.status(400).send({
            message: 'Please supply a valid email and password'
          })
       }
        
       else {
        User.findOne({
          where: {
            email: req.body.email
          }
        })
        .then(entity => {
          if (!entity) {
            res.status(401).send({
              message: 'User with that email does not exist'
            })
          }
      
          else if (bcrypt.compareSync(req.body.password, entity.password)) {
      
            res.send({
              jwt: toJWT({ userId: entity.id }),
              user: entity.id
            })
          }
          else {
            res.status(400).send({
              message: 'Password was incorrect'
            })
          }
        })
        .catch(err => {
          console.error(err)
          res.status(500).send({
            message: 'Something went wrong'
          })
        })
    
       }

})


module.exports=router