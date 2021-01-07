const User=require('../../models/user')

const {loginUser}=require('../../dao/user/login')
const {error_response}=require('../../utils/utils')

const bcrypt=require('bcrypt')

let saveUser=(req,res)=>{
    
    let body=req.body

    let user=new User({
        artistic_name: body.artistic_name,
        nick_name: body.nick_name,
        email: body.email,
        password: bcrypt.hashSync(body.password,10),
    })

    user.save((err,_)=>{

        if(err){return error_response(400,res,err)}

        loginUser(req,res)

    })
}


module.exports={
    saveUser
}