import mongoose from "mongoose"

const partnershipsSchema = new mongoose.Schema({
    _id: { type: Number, required: true },
    title: { type: String, default: "" },
    name: { type: String, default: "" },
    description: { type: String, default: "" },
    banner_image: { type: String, default: "" },
    path: { type: String, default: "" }
}, { collection: "partnerships" })

const partnershipsMenuSchema = new mongoose.Schema({
    name: { type: String, default: "", unique: true },
    path: { type: String, default: "" },
    menu: [
        {
            title: { type: String, default: "" },
            description: { type: String, default: "" },
            price: { type: String, default: "" },
            banner_image: { type: String, default: "" },
        }
    ]
}, { collection: "partnershipsMenu" })

export const partnerships = mongoose.model('partnerships', partnershipsSchema)
export const partnershipsMenu = mongoose.model('partnershipsMenu', partnershipsMenuSchema)


