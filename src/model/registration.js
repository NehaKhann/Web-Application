const mongoose = require("mongoose");
const bcrypt= require("bcryptjs");
const jwt= require("jsonwebtoken");

//schema

const employeeSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    gender:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true,
        unique:true
    },
    age:{
        type:Number,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    cpassword:{
        type:String,
        required:true
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
})

//creating token
//methods mtlb aap ab kese instance kay saath work kar rahay ho document hai jo collection say create kar rahay hain hum
//fat arrow function use nhi karsakhtay

employeeSchema.methods.generateAuthToken=async function(){
try {
    const token = jwt.sign({_id:this._id.toString()},process.env.SECRET);
  //oper jo token field hai usmain hum oper walay token ki value kay saath concatenate kar rahay hain
    this.tokens = this.tokens.concat({token:token})
    //ab hum database main add karaingain
    await this.save();
    return token;
} catch (error) {
    console.log(error);
}
}

//jab bhi schema create krtay hain jo middleware ka kaam krta hai
//pre mtlb phaylay save krnay say phaylay hash hojaye
//ismain fat arrow function kbhi nhi daynah
//middleware main next ko call krna zarori hai
//jab password change hoga tab he hash karo in case of updating data
employeeSchema.pre("save",async function(next){
    if(this.isModified("password")){
        // console.log(this.password);
        this.password =await bcrypt.hash(this.password,10);
        this.cpassword=await bcrypt.hash(this.cpassword,10)
        // // console.log(this.password);
        // this.cpassword=undefined;
    }
    next();

})



//creating collection

const Register = new mongoose.model("Register",employeeSchema);
module.exports=Register;