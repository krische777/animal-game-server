const jwt = require('jsonwebtoken')

const secret = process.env.JWT_SECRET || 'e9rp^&^*&@9sejg)DSUA)9999999fn,m'

function toJWT(data) {
    return jwt.sign(data, secret,
        { expiresIn: '2h' })
}

function toData(token) {
    return jwt.verify(token, secret)
}

module.exports = { toJWT, toData }