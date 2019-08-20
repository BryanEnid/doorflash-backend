// import types of typescript and modules
import { Application } from "express"
import express from "express"
import bodyParser from "body-parser";
import cors from "cors"

// Development Dependecies----
import consola from "consola"
import chalk from "chalk"
//----------------------------

const app: Application = express();
var port: string | number = process.env.PORT || 3000;

// Middleware are used with app.use()
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// import APIs
import PartnershipsAPI from "./apis/partnerships"
const partnershipsAPI = new PartnershipsAPI(app)
partnershipsAPI.initialize()

import DoorDash from "./scrapings/doorDash"
const doorDash = new DoorDash()
doorDash.start()

// Server Connection
app.listen(port, function () {
    consola.success(`${chalk.green('DONE . . . Server   running')} ${chalk.blue(`Port: ${port}`)}`)
});

// Database Connection
import database from "./database/config"
const mongodb = new database()
mongodb._connect(process.env.DB_HOST)