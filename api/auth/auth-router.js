// `checkUsernameFree`, `checkUsernameExists` ve `checkPasswordLength` gereklidir (require)
// `auth-middleware.js` deki middleware fonksiyonları. Bunlara burda ihtiyacınız var!
const express = require('express');
const router = express.Router();
const UsersModel = require('../users/users-model');
const { 
  usernameBostami, usernameVarmi, sifreGecerlimi   
} = require('./auth-middleware'); 
const bcrypt = require('bcryptjs');

// Kayıt ol route'ı
/**
  1 [POST] /api/auth/register { "username": "sue", "password": "1234" }

  response:
  status: 201
  {
    "user_id": 2,
    "username": "sue"
  }

  response username alınmış:
  status: 422
  {
    "message": "Username kullaniliyor"
  }

  response şifre 3 ya da daha az karakterli:
  status: 422
  {
    "message": "Şifre 3 karakterden fazla olmalı"
  }
 */
router.post('/register', usernameBostami, sifreGecerlimi, async (req, res, next) => {
  try {
    const hashedPassword = bcrypt.hashSync(req.body.password, 8);
    const user = {
      username: req.body.username,
      password: hashedPassword,
    };
    const newUser = await UsersModel.ekle(user);
    return res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
});

router.post('/login', usernameVarmi, sifreGecerlimi, async (req, res, next) => {
  try {

    const users = await UsersModel.goreBul({ username: req.body.username })
    const user = users[0];
    const isPasswordValid = bcrypt.compareSync(req.body.password, user.password);
    if (isPasswordValid) {
      req.session.user_id = user.user_id ;
      return res.status(200).json({ message: `Hoşgeldin ${user.username}!` });
    } else {
      return res.status(401).json({ message: "Geçersiz kriter!" });
    }
  } catch (error) {
    next(error);
  }
});

router.get('/logout', (req, res, next) => {
  if (req.session && req.session.user_id) {
    req.session.destroy()
    res.clearCookie('cikolatacips')
    return res.status(200).json({ message: "Çıkış yapildi" });
  } else {
    return res.status(200).json({ message: "Oturum bulunamadı!" });
  }
});
   
/**
  2 [POST] /api/auth/login { "username": "sue", "password": "1234" }

  response:
  status: 200
  {
    "message": "Hoşgeldin sue!"
  }

  response geçersiz kriter:
  status: 401
  {
    "message": "Geçersiz kriter!"
  }
 */


/**
  3 [GET] /api/auth/logout

  response giriş yapmış kullanıcılar için:
  status: 200
  {
    "message": "Çıkış yapildi"
  }

  response giriş yapmamış kullanıcılar için:
  status: 200
  {
    "message": "Oturum bulunamadı!"
  }
 */

 
// Diğer modüllerde kullanılabilmesi için routerı "exports" nesnesine eklemeyi unutmayın.
module.exports = router;