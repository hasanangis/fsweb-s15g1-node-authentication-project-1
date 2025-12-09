// `sinirli` middleware'ını `auth-middleware.js` dan require edin. Buna ihtiyacınız olacak!


/**
  [GET] /api/users

  Bu uç nokta SINIRLIDIR: sadece kullanıcı girişi yapmış kullanıcılar
  ulaşabilir.

  response:
  status: 200
  [
    {
      "user_id": 1,
      "username": "bob"
    },
    // etc
  ]

  response giriş yapılamadıysa:
  status: 401
  {
    "message": "Geçemezsiniz!"
  }
 */


// Diğer modüllerde kullanılabilmesi için routerı "exports" nesnesine eklemeyi unutmayın.

const express = require('express');
const router = express.Router();

const UsersModel = require('./users-model');
const { sinirli } = require('../auth/auth-middleware');

router.get('/', sinirli, async (req, res, next) => {
  try {
    return await UsersModel.bul()
      .then(users => {
        res.status(200).json(users);
      } );
  } catch (error) { 
    next(error);
  } 
});

module.exports = router;