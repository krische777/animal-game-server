const {Router} =require('express')
const User=require('./model')
const bcrypt=require('bcrypt')

const router=new Router()

router.post('/signup', (req, res, next)=>{
    //console.log(req.body)
    const user = {
      firstName: req.body.firstName,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10)
    } 
    User.create(user)
      .then(user=>res.json(user))
      .catch(next)

})

module.exports=router