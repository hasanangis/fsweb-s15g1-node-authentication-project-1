/**
  tüm kullanıcıları içeren bir DİZİ ye çözümlenir, tüm kullanıcılar { user_id, username } içerir
 */
const db = require("../../data/db-config");
async function bul() {
  const users = await db("users").select("user_id", "username");
  return users;

}

/**
  verilen filtreye sahip tüm kullanıcıları içeren bir DİZİ ye çözümlenir
 */
async function goreBul(filtre) {
  const users = await db("users").where(filtre).select("user_id", "username", "password" );
  return users; 
}

/**
  verilen user_id li kullanıcıya çözümlenir, kullanıcı { user_id, username } içerir
 */
async function idyeGoreBul(user_id) {
  const user = await db("users").where("user_id", user_id).first().select("user_id", "username");
  return user;  

}

/**
  yeni eklenen kullanıcıya çözümlenir { user_id, username }
 */
async function ekle(user) {
  const newUser = await db("users").insert(user).returning(["user_id", "username"]);
  return {
    user_id: newUser[0].user_id,
    username: newUser[0].username
  };
}
// Diğer modüllerde kullanılabilmesi için fonksiyonları "exports" nesnesine eklemeyi unutmayın.
module.exports = {
  bul,
  goreBul,  
  idyeGoreBul,
  ekle,
};  