const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    email: {type:String, required:true},
    password: { type:String, required:true, min:6}
});

const User = mongoose.model('users',UserSchema);

module.exports = User;