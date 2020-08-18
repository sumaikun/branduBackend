import * as mongoose from 'mongoose'

export const RulesSchema = new mongoose.Schema({
    created_by:{
        type:mongoose.Schema.Types.ObjectId || null,
        ref:"User",
    },
    modified_by:{
        type:mongoose.Schema.Types.ObjectId || null,
        ref:"User",
    },
    ruleType: {
        type:String,
        required:true,
    },
    supplier:{
        type:mongoose.Schema.Types.ObjectId || null,
        ref:"Supplier",
    },
    operationType: {
        type:String
    },
    if: {
        type:String
    },
    then: {
        type:String
    },
    similarity: {
        type:String
    },
    selectedFields: [{
        type:String
    }]
},
{
  timestamps: true
});

RulesSchema.set('toJSON', {
    virtuals: true,
    versionKey:false,
    transform: function (doc, ret) {   delete ret._id  }
});