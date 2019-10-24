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

app.use(cors({
  credentials: true,
  origin: 'http://localhost:8080'
}))

app.use(morgan('dev'))
app.use(bodyParser.json())

const path = require('path')
app.use(express.static(path.join(__dirname, 'dist/')))

const users = [{
  username: 'admin',
  password: 'Xav',
  meilleur_score: 0,
  historique: [
    {
      numeroPartie: 1,
      score: 0
    }
  ]
}]

const classementGlobal = [
  {
    username: 'admin',
    score: 0,
    rang: null
  }
]

const questions = [3, 'drapeau', '1998', 1, 2, 0, 2]

app.post('/api/login', (req, res) => {
  if (!req.session.userId) {
    const user = users.find(u => u.username === req.body.login && u.password === req.body.password)
    if (!user) {
      res.status(401)
      res.json({
        message: "user doesn't exist"
      })
    } else {
      // connect the user
      req.session.userId = 1000 // connect the user, and change the id
      classementGlobal.sort(function (a, b) {
        return a.score - b.score
      })
      for (var j = 0; j < classementGlobal.length; j++) {
        classementGlobal[j].rang = j + 1
      }
      res.json({
        message: 'connected',
        meilleur_score: user.meilleur_score,
        historique: user.historique,
        classement_global: classementGlobal
      })
    }
  } else {
    res.status(401)
    res.json({
      message: 'you are already connected'
    })
  }
})

app.post('/api/score', (req, res) => {
  const user = users.find(u => u.username === req.body.login && u.password === req.body.password)
  user.meilleur_score = req.body.meilleur_score
  user.historique.unshift({
    numeroPartie: user.historique.length + 1,
    score: req.body.score
  })
  const classement = classementGlobal.find(v => v.username === user.username)
  if (!classement) {
    classementGlobal.push({
      username: req.body.login,
      score: req.body.meilleur_score,
      rang: null
    })
  } else {
    classement.score = req.body.meilleur_score
  }
  classementGlobal.sort(function (a, b) {
    return a.score - b.score
  })
  for (var j = 0; j < classementGlobal.length; j++) {
    classementGlobal[j].rang = j + 1
  }
  res.json({
    message: 'score actualiser',
    historique: user.historique,
    classement_global: classementGlobal
  })
})

app.post('/api/reponse', (req, res) => {
  if (questions[req.body.type] === req.body.reponse) {
    res.json({
      message: 'true'
    })
  } else {
    res.json({
      message: 'false'
    })
  }
})

app.post('/api/addLog', (req, res) => {
  const user = users.find(u => u.username === req.body.login && u.password === req.body.password)
  if (!user) {
    users.push({
      username: req.body.login,
      password: req.body.password,
      meilleur_score: null,
      historique: []
    })
    res.json({
      message: 'user created succesfull'
    })
  } else {
    res.json({
      message: 'user already exist, please enter new id'
    })
  }
})

app.get('/api/logout', (req, res) => {
  if (!req.session.userId) {
    res.status(401)
    res.json({
      message: 'you are already disconnected'
    })
  } else {
    req.session.userId = 0
    res.json({
      message: 'you are now disconnected'
    })
  }
})

app.get('/api/admin', (req, res) => {
  if (!req.session.userId || req.session.isAdmin === false) {
    res.status(401)
    res.json({ message: 'Unauthorized' })
  }

  res.json({
    message: 'congrats, you are connected'
  })
})

const port = process.env.PORT || 4000
app.listen(port, () => {
  console.log(`listening on ${port}`)
})
