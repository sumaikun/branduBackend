import * as mongoose from 'mongoose'

export const ProductTraceSchema = new mongoose.Schema({
    created_by:{
        type:mongoose.Schema.Types.ObjectId || null,
        ref:"User",
    },
    modified_by:{
        type:mongoose.Schema.Types.ObjectId || null,
        ref:"User",
    },
    chronos:{
        type:mongoose.Schema.Types.ObjectId || null,
        ref:"Chronos",
    },
    supplier:{
        type:mongoose.Schema.Types.ObjectId || null,
        ref:"Supplier",
    },
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

ProductTraceSchema .set('toJSON', {
    virtuals: true,
    versionKey:false,
    transform: function (doc, ret) {   delete ret._id  }
});