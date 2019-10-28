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

var username = ''

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
      username = req.body.login
      req.session.userId = 1000 // connect the user, and change the id
      res.json({
        message: 'connected'
      })
    }
  } else {
    res.status(401)
    res.json({
      message: 'you are already connected'
    })
  }
})

app.get('/api/historique', (req, res) => {
  const user = users.find(u => u.username === username)
  res.json({
    message: 'Historique correctement récupérés',
    historique: user.historique
  })
})

app.get('/api/meilleurScore', (req, res) => {
  const user = users.find(u => u.username === username)
  res.json({
    message: 'Meilleur score actualisé',
    meilleur_score: user.meilleur_score,
    username: username
  })
})

app.post('/api/classement', (req, res) => {
  const classement = classementGlobal.find(v => v.username === username)
  const user = users.find(u => u.username === username)
  if (user.meilleur_score !== null) {
    if (!classement) {
      classementGlobal.push({
        username: username,
        score: user.meilleur_score,
        rang: null
      })
    } else {
      classement.score = user.meilleur_score
    }
  }
  classementGlobal.sort(function (a, b) {
    return a.score - b.score
  })
  for (var j = 0; j < classementGlobal.length; j++) {
    classementGlobal[j].rang = j + 1
  }
  res.json({
    message: 'Classement global correctement actualisé et récupérés',
    classementGlobal: classementGlobal
  })
})

app.post('/api/score', (req, res) => {
  const user = users.find(u => u.username === username)
  user.historique.unshift({
    numeroPartie: user.historique.length + 1,
    score: req.body.score
  })
  if (user.meilleur_score > req.body.score || user.meilleur_score === null) {
    user.meilleur_score = req.body.score
  }
  res.json({
    message: 'score actualisé'
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
    username = ''
    req.session.destroy()
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
