
import mongoose, { model } from "mongoose";
import { Schema } from "mongoose";

interface ISettings{
    ownerId:string
    businessName:string
    supportEmail:string
    knowledge:string
}
const settingschema= new Schema<ISettings>({
    ownerId:{
        type:String,
        required:true,
        unique:true
    },
    
    businessName:{
        type:String,
        
    },
    supportEmail:{
        type:String,
    },
     knowledge :{
        type:String,
    },
},{timestamps:true})

const settings=mongoose.models.settings || model("settings", settingschema)
export default settings