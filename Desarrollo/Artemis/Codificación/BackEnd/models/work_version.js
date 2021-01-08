const mongoose=require('mongoose')
const uniqueValidator=require('mongoose-unique-validator')

let Schema=mongoose.Schema

let workVersionSchema=new Schema({
    name:{
        type: String,
        unique: true,
        required: [true, 'Name is required']
    },
    work:{
        type: Schema.Types.ObjectId,
        ref: 'Work'
    },
    modified_by:[{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    created_date:{
        type: Date,
        required: [true, "Created date is required"]
    },
    file:{
        type: String,
        required: [true, "File is required"]
    }
})

workSchema.plugin(uniqueValidator,{message:'{PATH} tiene que ser único'})

module.exports=mongoose.model('WorkVersion', workVersionSchema)