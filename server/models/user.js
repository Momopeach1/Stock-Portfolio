const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


//User Schema for mongoose
const userSchema = new mongoose.Schema({
  name: String,
  password: String,
  email: { type: String, unique: true, lowercase: true },
  transactions: { type: Array, default: [] }, //{ticker: name, shares: number, atPrice: price bought}
  balance: { type: Number, default: 5000.00 },
  inventory: { type: Array, default: [] } // {ticker: APPL, Shares: 4}
});

//Password hashing
userSchema.pre('save', function(next) {
  const user = this;

  bcrypt.genSalt(10, (err, salt) => {
    if(err) return next(err);

    bcrypt.hash(user.password, salt, (err, hash) => {
      if(err) return next(err);
      user.password = hash;
      next();
    });
  });
});


//User Methods
userSchema.methods.comparePassword = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if(err) {return callback(err);}
    callback(null, isMatch);
  });
}

module.exports = mongoose.model('user', userSchema);