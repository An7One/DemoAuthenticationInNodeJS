import express from 'express'
import path from 'path'
import bodyParser from 'body-parser'
import session from 'express-session'
import cors from 'cors'
import errorHandler from 'errorhandler'
import morgan from 'morgan'
import { connectToDb } from './database'
import { User } from './model/User'

// to configure isProduction variable
const isProduction = process.env.NODE_ENV === 'production'

// to initiate our app
const app = express()

// to configure our app
app.use(cors())
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')))
app.use(
  session({
    secret: 'passport-tutorial',
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false
  })
)

if (!isProduction) {
  app.use(errorHandler())
}

// to configure Mongoose
connectToDb

// Error handlers & middlewares
if (!isProduction) {
  app.use((err, req, res) => {
    res.status(err.status || 500)

    res.json({
      errors: {
        message: err.message,
        error: err
      }
    })
  })
}

app.use((err, req, res) => {
  res.status(err.status || 500)

  res.json({
    errors: {
      message: err.message,
      error: {}
    }
  })
})

app.listen(3007, () => console.log('Server running on http://localhost:3007/'))
