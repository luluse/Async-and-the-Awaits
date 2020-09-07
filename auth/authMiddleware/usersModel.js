'use strict';
const mongoose = require('mongoose');
const userSchema = new mongoose.Schema( {
  id: { type: String, required: true},
  username: { type: String, unique: true, required: true},
  password: { type: String, unique: true, required: true},
  favoriteLanguage: { type: String, required: false},
  description: { type: String, required: false },
  },
  { timestamps: true},
);

// userSchema.pre('remove', function(next) {
//     this.model('Message').deleteMany({ user: this._id }, next);
//   });
//   const User = mongoose.model('User', userSchema);
//   export default User;

  userSchema.statics.authenticateBasic = async function (username, password) {
  let user = await this.findOne({username});
  
  return user && await user.comparePassword(password);
};

userSchema.methods.comparePassword = async function (plainPassword){
    try{
        const passwordMatch = await bcrypt.compare(plainPassword, this.password);
        return passwordMatch ? this : null;
    } catch(error){
        throw new Error("you've encountered an Error", error);
    };
}
module.exports = mongoose.model('userSchema', userSchema);