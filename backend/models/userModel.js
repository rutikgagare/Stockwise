  const mongoose = require('mongoose')
  const bcrypt = require('bcrypt')
  const validator = require('validator')

  const Schema = mongoose.Schema

  const userSchema = new Schema({
    name:{
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      Single: true
    },
    password: {
      type: String,
      required: true
    },
    role:{
      type: String, 
      enum: ['admin', 'employee'], 
      default: 'admin' 
    },

  }, { timestamps: true })

  // static method
  userSchema.statics.signup = async function(name, email, password, role = "admin"){
      // validation
      if(!email || !password || !name){
          throw Error("All field must be field");
      }

      if(!validator.isEmail(email)){
          throw Error("Email is not valid");
      }

      if(!validator.isStrongPassword(password)){
          throw Error("Password not strong enough");
      }

      const exists = await this.findOne({email});

      if(exists){
          throw Error("Email already in use")
      }

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);

      const user = await this.create({name, email, password:hash, role });
      return user;
  }

  // static login method
  userSchema.statics.login = async function(email, password){
    if(!email || !password){
      throw Error("All field must be field");
    }

    const user = await this.findOne({email});

    if(!user){
      throw Error("Entered email is not registered");
    }

    const match = await bcrypt.compare(password, user.password);

    if(!match){
      throw Error("Invalid password");
    }

    return user;
  }

  module.exports = mongoose.model('User', userSchema)