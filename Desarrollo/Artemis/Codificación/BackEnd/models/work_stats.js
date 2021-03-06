const mongoose=require('mongoose')

let Schema=mongoose.Schema

let workStatsSchema=new Schema({
    work:{
        type: Schema.Types.ObjectId,
        ref: 'Work'
    },
    likes:{
        type: Number,
        default: 0
    },
    dislikes:{
        type: Number,
        default: 0
    },
    comentaries:[{
        type: Schema.Types.ObjectId,
        ref: 'Comentary'
    }],
    reports:{
        type: Number,
        default: 0
    },
    usersThatLiked:[{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    usersThatDisliked:[{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    usersReport:[{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
})

module.exports=mongoose.model('WorkStats',workStatsSchema)
