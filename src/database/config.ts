import mongoose from "mongoose"

//
import { partnerships, partnershipsMenu } from "./schemas/partnerships"

export default class Database {
    public partnerships = partnerships
    public partnershipsMenu = partnershipsMenu
    public db = mongoose.connection

    public _connect = async (DB_HOST: any) => {
        try {
            mongoose.connect(`${DB_HOST}/${process.env.DB_NAME}`, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false })
            console.log(`DONE . . . Database running on ${DB_HOST}/${process.env.DB_NAME}${process.env.DB_PARAMETERS}`)
        } catch {
            console.log("database not connected")
        }
    }


}