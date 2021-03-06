const User=require('../../models/user');
const Folder=require('../../models/work_folder');
const Work=require('../../models/work');
const Stats=require('../../models/work_stats')
const Version=require('../../models/work_version')
const {
    error_response, 
    custom_error_response,
    custom_response,
    unique_with_name,
    fillExistingArray
}=require('../../utils/utils')
const fs = require('fs-extra');
const cloudinary = require('cloudinary')

async function create_work(req, res){

    User.findById(req.user._id)
    .exec(async (err, user)=>{

        if(err){ return error_response(400, res, err) }

        if(user==null){ return custom_error_response(400, res, "Usuario no encontrado") }

        //Encontró el usuario

        Folder.findOne({name: req.query.folder_name, owner: req.user._id})
        .populate('works')
        .exec(async (err, folder)=>{
 
            if(err){ return error_response(400, res, err) }

            if(folder==null){ return custom_error_response(400, res, "Folder no encontrado") }

            if(!unique_with_name(folder.works, req.body.name)) { return custom_error_response(400, res, "Obra ya existe") }

            let work=new Work({
                name: req.body.name,
                owner: req.user._id,
                description: req.body.description,
                private: req.body.private,
                folder: folder._id
            })

            if(req.files.image[0] != undefined)
            {
                const result = await cloudinary.v2.uploader.upload(req.files.image[0].path)
                console.log('Imagen subida a cloudinary')
                
                //cambiar parametros
                work.img_url = result.url
                work.img_public_id = result.public_id
            }

            if(work.tag){
                fillExistingArray(work.tag,req.body.tag)
            }

            if(work.private && req.body.private_viewers){
                fillExistingArray(work.private_viewers,req.body.private_viewers)
            }

            let version=new Version({
                name: req.body.version_name,
                created_date: new Date(),
                file: req.files.file.name
            })

            if(req.files.file[0] != undefined)
            {
                const result = await cloudinary.v2.uploader.upload(req.files.file[0].path, { resource_type: "auto" }, 
                function(error, result) {console.log(result, error); })
                console.log('Archivo subido a cloudinary')
                
                //cambiar parametros
                version.file_url = result.url
                version.file_public_id = result.public_id
            }

            if(!version.name){
                return custom_error_response(400,res,"Nombre de la version es requerido")
            }

            let stats=new Stats({
                likes: 0,
                dislikes: 0,
                reports: 0
            })

            work.save(async(err,workDB)=>{

                if(err){return error_response(400,res,err)}

                stats.work=workDB._id
                version.work=workDB._id
                
                let id=workDB._id

                folder.works.push(work._id)

                folder.save((err,_)=>{
                    if(err){return error_response(400,res,err)}
                })
 
                stats.save((err,statsDB)=>{
                    if(err){return error_response(400,res,err)}
                    let references={
                        stats: statsDB._id
                    }
                    Work.findByIdAndUpdate(id,references,(err,_)=>{
                        if(err){return error_response(400,res,err)}
                    })
                })

                version.save((err,versionDB)=>{
                    if(err){return error_response(400,res,err)}
                    let references={
                        current_version: versionDB._id
                    }
                    Work.findByIdAndUpdate(id,references,(err,_)=>{
                        if(err){return error_response(400,res,err)}
                    })
                })

                if(req.files.image[0] != undefined) { await fs.unlink(req.files.image[0].path); console.log('Imagen borrada de backend')}
                
                if(req.files.file[0] != undefined) { await fs.unlink(req.files.file[0].path); console.log('Archivo borrado de backend') }
                
    
                custom_response(res,"Trabajo creado con éxito")

            })  
        })
    })
}

module.exports={create_work}
