import { Application, Request, Response } from "express"
import { Model } from "mongoose"

import Database from "../database/config"

export default class PartnershipsAPI {
    private app: Application;
    private initialized: boolean;
    private partnershipsDB: Model<any>;
    private partnershipsMenuDB: Model<any>;

    constructor(app: Application) {
        this.app = app
        this.initialized = false
        this.partnershipsDB = new Database().partnerships
        this.partnershipsMenuDB = new Database().partnershipsMenu
    }

    public initialize() {
        if (this.initialized !== true) {
            this.initialized = true

            //API initialize
            this.getData()

        } else {
            throw new Error('"partnershipAPI" is already initialized, please don\'t initialize more than once.')
        }
    }

    private getData() {
        this.app.get(`/v1/partnerships/`, async (req: Request, res: Response) => {
            let document = await this.partnershipsDB.find()
            res.send(document)
        })

        this.app.get(`/v1/partnerships/:name`, async (req: Request, res) => {
            let doc = await this.partnershipsDB.find({ name: req.params.name })
            doc.length != 0 ? res.send(doc) : res.status(404).send({
                error: {
                    message: `${req.originalUrl} was not found`,
                    success: false,
                    status: 404
                }
            })
        })

        this.app.get(`/v1/partnerships/:name/menu?`, async (req: Request, res: Response) => {
            try {
                let { limit, skip } = req.query
                limit = parseInt(limit) || 10
                skip = parseInt(skip) || 0

                const docElementsCount = await this.partnershipsMenuDB.aggregate([{ $match: { name: req.params.name } }, { $unwind: "$menu" }, { $count: "__v" }])
                const elementsCount = docElementsCount[0].__v

                const pages = Math.ceil(elementsCount / limit)
                let actualPage: number | boolean = Math.ceil((skip + limit) / limit)

                if (skip % limit != 0) {
                    actualPage = false
                }

                if (actualPage > pages || !actualPage) {
                    if (actualPage) {
                        res.send({ success: false, error: { message: `Not found - Try another query options`, limit: limit, skip: skip, success: false, status: 404, actualPage: false } })
                    } else {
                        res.send({ actualPage: false })
                    }
                } else {
                    const doc = await this.partnershipsMenuDB.find({ name: req.params.name }, { menu: { $slice: [skip, limit] } }).lean()

                    doc[0].pagination = { elementsCount, pages, skip, limit, actualPage }
                    doc[0].success = true

                    doc.length != 0 ? res.send(...doc) : res.status(404).send({ success: false, error: { message: `${req.originalUrl} was not found`, success: false, status: 404 } })
                }
            }

            catch (err) {
                res.status(404).send({
                    error: {
                        message: `${req.originalUrl} was not found`,
                        success: false,
                        status: 404
                    }
                })
            }
        })

        this.app.get('*', (req: Request, res: Response) => {
            res.status(404).send({
                error: {
                    message: `${req.originalUrl} was not found`,
                    success: false,
                    status: 404
                }
            })
        });
    }
}