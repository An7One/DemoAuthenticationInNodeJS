import mongoose from 'mongoose'
import passport from 'passport'
import express from 'express'
import auth from '../auth'
// import User from '../../model/User'

const router = express.Router()
const User = mongoose.model('User')

router.post('/register', auth.optional, (req, res, next) => {
  const {
    body: { user }
  } = req

  if (!user.email) {
    return res.status(422).json({
      errors: {
        email: 'is required'
      }
    })
  }

  if (!user.password) {
    return res.status(422).json({
      errors: {
        password: 'is required'
      }
    })
  }

  const finalUser = new User(user)
  finalUser.setPassword(user.password)
  // return finalUser.save().then(() => res.json({ user: finalUser.toAuthJSON() }))
  return finalUser.save().then((err, res) => {
    console.error(err)
    console.log(JSON.stringify(res))
  })
})

router.post('/login', auth.optional, (req, res, next) => {
  const {
    body: { user }
  } = req

  if (!user.email) {
    return res.status(422).json({
      errors: {
        email: 'is required'
      }
    })
  }

  if (!user.password) {
    return res.status(422).json({
      errors: {
        password: 'is required'
      }
    })
  }

  return passport.authenticate(
    'local',
    { session: false },
    (err, passportUser, info) => {
      if (err) {
        return next(err)
      }

      if (passportUser) {
        const user = passportUser
        user.token = passportUser.generateJWT()
        console.log('')

        return res.json({ user: user.toAuthJSON() })
      }

      return status(400).info
    }
  )(req, res, next)
})

router.get('/current', auth.required, (req, res, next) => {
  const {
    payload: { id }
  } = req

  return User.findById(id).then(user => {
    if (!user) {
      return res.sendStatus(400)
    }

    return res.json({ user: user.toAuthJSON() })
  })
})

module.exports = router
