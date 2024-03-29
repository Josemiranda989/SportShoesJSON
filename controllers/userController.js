const fs = require('fs')
const path = require('path')
const { validationResult } = require('express-validator')
const bcryptjs = require('bcryptjs')

const User = require('../models/User')

/* Lista de Productos .JSON */
const allUsersFilePath = path.join(__dirname, '../data/users.json')
const allUsers = JSON.parse(fs.readFileSync(allUsersFilePath, 'utf-8'))

const userController = {

  register: (req, res) => {
      res.render('register')
  },

  processRegister: (req, res) => {
    const resultValidation = validationResult(req)

    if (resultValidation.errors.length > 0) {
      return res.render('register', {
        //mapped convierte un array en objeto literal
        errors: resultValidation.mapped(),
        oldData: req.body,
      })
    }

    let userInDB = User.findByField('email', req.body.email)

    if (userInDB) {
      return res.render('register', {
        errors: {
          email: {
            msg: 'This email is already registered',
          },
        },
        oldData: req.body,
      })
    }

    let userToCreate = {
      ...req.body,
      password: bcryptjs.hashSync(req.body.password, 10),
      avatar: req.file.filename,
    }

    let userCreated = User.create(userToCreate)

    return res.redirect('/user/login')
  },

  login: (req, res) => {
    res.render('login')
  },

  loginProcess: (req, res) => {
      let userToLogin = User.findByField('email', req.body.email);
		
      if(userToLogin) {
        let isOkThePassword = bcryptjs.compareSync(req.body.password, userToLogin.password);
        if (isOkThePassword) {
          delete userToLogin.password;
          req.session.userLogged = userToLogin;

          if(req.body.remember_user) {
            res.cookie('userEmail', req.body.email, { maxAge: (1000 * 60) * 60 }) //60 minutos
          }

          return res.redirect('/user/profile');
        } 

      return res.render('login', {
        errors: {
          email: {
            msg: 'Password is invalid',
          }
        }
      })
    }

    return res.render('login', {
      errors: {
        email: {
          msg: 'This registered email cannot be found',
        },
      },
    })
  },

  profile: (req, res) => {
    res.render('userProfile', {
      user: req.session.userLogged,
    })
  },
  
  logout: (req, res) => {
    res.clearCookie('userEmail');
    req.session.destroy();      
    return res.redirect('/')
  }
}

module.exports = userController
