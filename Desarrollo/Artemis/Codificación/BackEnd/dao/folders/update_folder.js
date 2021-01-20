const User=require('../../models/user');
const Folder=require('../../models/work_folder');
const {error_response, custom_error_response, custom_response, unique_with_name}=require('../../utils/utils')

function update_folder(req, res){

    User.findOne({nick_name: req.user.nick_name})
    .populate('folders')
    .exec(function (err, user){

        if(err){ return error_response(400, res, err) }

        if(user==null){ return custom_error_response(400, res, "Usuario no encontrado") }

        if(!unique_with_name(user.folders, req.body.name)) { return custom_error_response(400, res, "Folder ya existe") }

        Folder.findOne({name: req.query.folder_name, owner: user._id})
        .exec(function (err, folder){
            if(err){ return error_response(400, res, err) }

            if(folder==null){ return custom_error_response(400, res, "Folder no encontrado") }  

            folder.name = req.body.name

            folder.save((err)=>{
                if(err){ return error_response(400, res, err) }

                return custom_response(res, "Folder actualizado con exito")
            })
        })
    })
}

module.exports={update_folder}