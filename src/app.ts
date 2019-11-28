// import types of typescript and modules
import { Application } from "express"
import express from "express"
import bodyParser from "body-parser";
import cors from "cors"

// Development Dependecies----
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

// Server Connection
app.listen(port, function () {
    console.log(`DONE . . . Server   running Port: ${port}`)
});

// Database Connection
import database from "./database/config"
const mongodb = new database()
mongodb._connect(process.env.DB_HOST)