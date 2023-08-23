const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  first_name: { type: String, required: true, maxLength: 30 },
  last_name: { type: String, required: true, maxLength: 30 },
  username: { type: String, required: true, maxLength: 30 },
  password: { type: String, required: true },
  membership_status: { type: Boolean, default: false },
});

UserSchema.virtual('name').get(function () {
  // To avoid errors in cases where an author does not have either a family name or first name
  // We want to make sure we handle the exception by returning an empty string for that case
  let fullname = '';
  if (this.first_name && this.last_name) {
    fullname = `${this.last_name}, ${this.first_name}`;
  }

  return fullname;
});

// Create a static method to get a user's messages?

module.exports = mongoose.model('User', UserSchema);
