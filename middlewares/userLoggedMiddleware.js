const User = require('../models/User')

function userLoggedMiddleware(req, res, next) {
  res.locals.isLogged = false

  if (req.session && req.session.userLogged) {
    res.locals.isLogged = true
    res.locals.userLogged = req.session.userLogged
    }
    
  let emailInCookie = req.cookies.userEmail
  let userFromCookie = User.findByField('email', emailInCookie) //usuario sacado de cookie

  if (userFromCookie) {
    req.session.userLogged = userFromCookie
  }

  if (req.session.userLogged) {
    res.locals.isLogged = true
    res.locals.userLogged = req.session.userLogged
  }

  next()
}

module.exports = userLoggedMiddleware
