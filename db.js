const Sequelize = require('sequelize')

const databaseUrl = process.env.DATABASE_URL || 'postgres://postgres:animal-app@localhost:9999/postgres'

const db = new Sequelize((databaseUrl))

db.sync()
    .then(() => console.log('database synced'))
    .catch(console.error)

module.exports = db