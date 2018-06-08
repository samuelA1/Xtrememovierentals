const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {type: String, lowercase: true},
    password: {type: String},
    picture: String,
    email: {type: String, unique: true, lowercase: true},
    isAdmin: {type: Boolean, default: false},
    isSeller: {type: Boolean, default: false},
    created: {type: Date, default: Date.now},
    address: {
        addr1: String,
        addr2: String,
        city: String,
        state: String,
        country: {type: String, default: 'United States'},
        zip: Number
    }
});

UserSchema.pre('save', function(next) {
    const user = this;

    if(!user.isModified('password')) return next();

    bcrypt.hash(user.password, null, null, function(err, hash) {
        if (err) {return next(err)}

        user.password = hash
        next();
    });

});

UserSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}

UserSchema.methods.gravatar = function(size) {
    if (!this.size) size = 200;
    if (!this.email) {
      return 'https://gravatar.com/avatar/?s' + size + '&d=retro';
    } else {
      var md5 = crypto.createHash('md5').update(this.email).digest('hex');
      return 'https://gravatar.com/avatar/' + md5 + '?s' + size + '&d=retro'; 
    }
  
  }

  module.exports = mongoose.model('User', UserSchema);