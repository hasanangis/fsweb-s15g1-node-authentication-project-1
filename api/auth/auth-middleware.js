/*
  Kullanıcının sunucuda kayıtlı bir oturumu yoksa

  status: 401
  {
    "message": "Geçemezsiniz!"
  }
*/
const UsersModel = require("./../users/users-model");

function sinirli(req, res, next) {
  if (req.session && req.session.user_id) {
    next();
  } else {
    return res.status(401).json({ message: "Geçemezsiniz!" });
  }
}

/*
  req.body de verilen username halihazırda veritabanında varsa

  status: 422
  {
    "message": "Username kullaniliyor"
  }
*/
async function usernameBostami(req, res, next) {
const users = await UsersModel.goreBul({ username: req.body.username });
const user = users[0];
if (user) {
  return res.status(422).json({ message: "Username kullaniliyor" });  
}
next();
}

/*
  req.body de verilen username veritabanında yoksa

  status: 401
  {
    "message": "Geçersiz kriter"
  }
*/
async function usernameVarmi(req, res, next) {

  const users = await UsersModel.goreBul({ username: req.body.username });
  const user = users[0];
  if (!user) {
    return res.status(401).json({ message: "Geçersiz kriter" });  
  }
  req.user = user;
  next();

}

/*
  req.body de şifre yoksa veya 3 karakterden azsa

  status: 422
  {
    "message": "Şifre 3 karakterden fazla olmalı"
  }
*/
function sifreGecerlimi(req, res, next) {
  if (!req?.body?.password || req?.body?.password?.length < 3) {
    return res.status(422).json({ message: "Şifre 3 karakterden fazla olmalı" }); 
  }
  next();
}

// Diğer modüllerde kullanılabilmesi için fonksiyonları "exports" nesnesine eklemeyi unutmayın.
module.exports = {
  sinirli,
  usernameBostami,      
  usernameVarmi,
  sifreGecerlimi,
};
