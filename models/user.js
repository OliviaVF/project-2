const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  image: { type: String, required: true },
  name: { type: String, required: true },
  username: { type: String },
  email: { type: String },
  password: { type: String }
});

userSchema.virtual('imageSRC')
  .get(function imageSRC(){
    if(!this.image) return null;
    if(this.image.match(/assets/)) return this.image;
    if(this.image.match(/^http/)) return this.image;
    return `https://s3-eu-west-1.amazonaws.com/wdi-25-london-project-2/${this.image}`;
  });

userSchema
  .virtual('passwordConfirmation') // virtual because you don't want to store it in the database but we do want to check it's there and do some logic with it.
  .set(function setPasswordConfirmation(passwordConfirmation) {
    this._passwordConfirmation = passwordConfirmation;
  });

//lifecycle hook = mongoose middleware. Will run pre-validation(see line below)
userSchema.pre('validate', function checkPassword(next) {
  if(!this.password && !this.facebookId) {
    this.invalidate('password', 'required');
  }
  if(this.isModified('password') && this._passwordConfirmation !== this.password) this.invalidate('passwordConfirmation', 'does not match');
  next();
});

userSchema.pre('save', function hashPassword(next) { // call next otherwise Mongoose doesn't know what to do
  if(this.isModified('password')) {
    this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(8));
  }
  next();
});

userSchema.pre('remove', function deleteUsersPylons(next) {
  this.model('Pylon').remove({ createdBy: this.id }, next);
});

userSchema.methods.validatePassword = function validatePassword(password) { //methods is creating instance method on our user
  return bcrypt.compareSync(password, this.password);
};


module.exports = mongoose.model('User', userSchema); //'User' tells mongoose what collection to create in the database
