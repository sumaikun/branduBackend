import * as mongoose from 'mongoose'

export const BackupSchema = new mongoose.Schema({
    shopifyProduct:{
        type:Object
    },
    shopifyId:{
        type:String
    }
},
{
  timestamps: true
});

BackupSchema.set('toJSON', {
    virtuals: true,
    versionKey:false,
    transform: function (doc, ret) {   delete ret._id  }
});