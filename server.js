/**
 *
 * entrez la commande suivante:
 * npm install --save express express-session body-parser morgan cors
 */
const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const session = require('express-session')

const app = express()

app.use(session({
  secret: 'blablabla', // changez cette valeur
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // ne changez que si vous avez activé le https
}))
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(cors())

app.get('/api/test', (req, res) => {
  console.log('coucou')
  res.json({
    message: "ceci est envoyé depuis l'API"
  })
})

app.get('/api/login', (req, res) => {
  if (!req.session.userId) {
    // connect the user
    req.session.userId = 1000 // connect the user, and change the id
    res.json({
      message: 'connected'
    })
  } else {
    res.status(401)
    res.json({
      message: 'you are already connected'
    })
  }
})

app.get('/api/admin', (req, res) => {
  if (!req.session.userId || req.session.isAdmin === false) {
    res.status(401)
    res.json({ message: 'Unauthorized' })
    return
  }

  res.json({
    message: 'congrats, you are connected'
  })
})

const port = process.env.PORT || 4000
app.listen(port, () => {
  console.log(`listening on ${port}`)
})
