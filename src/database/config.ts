import mongoose from "mongoose"

//
import { partnerships, partnershipsMenu } from "./schemas/partnerships"

export default class Database {
    public partnerships = partnerships
    public partnershipsMenu = partnershipsMenu

    public _connect = async (DB_HOST: any) => {
        try {
            mongoose.connect(`${DB_HOST}/${process.env.DB_NAME}`, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false })
            const db = mongoose.connection
            console.log(`DONE . . . Database running on ${DB_HOST}/${process.env.DB_NAME}`)
        } catch {
            console.log("database not connected")
        }
    }


}