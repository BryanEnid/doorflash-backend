import mongoose from "mongoose"
import consola from "consola"
import chalk from "chalk"

//
import { partnerships, partnershipsMenu } from "./schemas/partnerships"

export default class Database {
    public partnerships = partnerships
    public partnershipsMenu = partnershipsMenu

    public _connect = async (DB_HOST: any) => {
        try {
            mongoose.connect(`${DB_HOST}/${process.env.DB_NAME}`, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false })
            const db = mongoose.connection
            consola.success(`${chalk.green('DONE . . . Database running on')} ${DB_HOST}/${process.env.DB_NAME}`)
        } catch {
            consola.error("database not connected")
        }
    }


}