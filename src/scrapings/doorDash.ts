import puppeteer from "puppeteer"
import schedule from "node-schedule"

import Database from "../database/config"
import { Model } from "mongoose"
// import { restaurants } from "../interfaces/doorDash"


export default class DoorDash {
    private URI: string = "https://www.doordash.com";
    private partnershipsDB: Model<any> = new Database().partnerships
    private partnershipsMenuDB: Model<any> = new Database().partnershipsMenu
    private restaurants: any = []
    private scrappedRestaurants: any = []

    public start = () => {
        console.log("Initialized")
        this.scrappeWithPuppeteer()
        this.updateAPIDaily()
    }

    private updateAPIDaily = () => {
        schedule.scheduleJob('* * 7 * * *', () => {
            this.scrappeWithPuppeteer()
        })
    }

    public scrappeWithPuppeteer = async () => {
        console.log("Scrapping...")
        const browser = await puppeteer.launch({ headless: false, devtools: false, defaultViewport: null, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
        const page = await browser.newPage();

        await page.goto(`${this.URI}/consumer/login/`);

        //Login in doordash
        await page.type("#login-form input[type=email]", `${process.env.DD_USER}`)
        await page.type("#login-form input[type=password]", `${process.env.DD_PSWD}`)
        await page.click('button[type=submit]')
        await page.waitForNavigation();

        //Get Top Restaurant
        await page.goto(`${this.URI}/categories/282/`)
        await page.waitForSelector("[data-anchor-id=StoreCard]")
        await this.getRestaurantsData(page, browser)

        await page.goto(`${this.URI}/categories/18440/`)
        await page.waitForSelector("[data-anchor-id=StoreCard]")
        await this.getRestaurantsData(page, browser)

        await this.getRestaurantsMenu(page)

        await browser.close();

        // Save scrapped data to Database

        this.saveFetchedDataToDatabase(this.scrappedRestaurants)
    }

    getRestaurantsData = async (page: any, browser: any): Promise<any> => {
        console.log("Getting Restaurants data...")
        this.restaurants = await page.evaluate(() => {
            return Array.from(document.querySelectorAll("[data-anchor-id=StoreCard]")).map((item: any) => {
                let [title, description, x] = item.lastChild.children[0].childNodes

                let path: string = item.pathname
                let store_id: number = Number(item.dataset.storeId)

                if (title) title = title.textContent
                if (description) description = description.textContent

                let removeSpace = title.replace(/ /g, "_")
                let removeSimbols = removeSpace.replace(/\'/g, "")
                let removeSimbols2 = removeSimbols.replace(/\®/g, "")
                let name = removeSimbols2.toLowerCase()

                return {
                    title,
                    name,
                    description,
                    path,
                    _id: store_id
                }
            })
        })

        const logosPage = await browser.newPage()
        for (let i = 0; i < this.restaurants.length; i++) {
            await logosPage.goto(`https://worldvectorlogo.com/search/${this.restaurants[i].title}`)
            await logosPage.waitForSelector(".logo__img")

            this.restaurants[i].banner_image = await logosPage.evaluate(() => {
                let image: any = document.querySelectorAll(".logo__img")[0]
                return image.src
            })
        }
        logosPage.close()
    }

    getRestaurantsMenu = async (page: any) => {
        console.log("Getting Restaurants menu...")
        console.log(this.restaurants.length)
        for (let i = 0; i < this.restaurants.length; i++) {
            try {
                let item = this.restaurants[i]
                let path = item.path

                await page.goto(`${this.URI}${path}`)
                await page.waitForSelector("[data-anchor-id=MenuItem]")

                let menu = await page.evaluate(() => {
                    return Array.from(document.querySelectorAll("[data-anchor-id=MenuItem]")).map((item: any) => {
                        let [data, banner_image] = item.children[0].children[0].children[0].children[0].children[0].children[0].childNodes
                        let [title, description, price] = data.childNodes

                        if (!title) title = ""
                        if (!description) description = ""
                        if (!price) price = ""
                        if (!banner_image) banner_image = ""

                        if (title) title = title.textContent
                        if (description) description = description.textContent
                        if (price) price = price.textContent
                        if (banner_image) {
                            let regex = /https:(.*?).jpg/gm;
                            let arr;
                            let str = banner_image.children[0].children[0].children[1].srcset
                            let result
                            while ((arr = regex.exec(str)) !== null) {
                                result = arr[0]
                            }
                            banner_image = result
                        }

                        return {
                            title,
                            description,
                            price,
                            banner_image
                        }
                    })
                })

                if (!menu) console.log(menu)
                item.menu = menu
                this.scrappedRestaurants.push(item)
            } catch (err) {
                console.log("Failed to get menu")
                return
            }

        }

    }

    saveFetchedDataToDatabase = async (restaurants: any) => {
        console.log("Saving to Database...")
        for (let i = 0; i < restaurants.length; i++) {
            const restaurant = restaurants[i];
            const restaurantMenu = restaurants[i].menu;
            try {
                await this.partnershipsMenuDB.findOneAndUpdate({ name: restaurant.name }, {
                    name: restaurant.name,
                    menu: restaurantMenu
                }, { upsert: true })
                delete restaurant.menu
                await this.partnershipsDB.findOneAndUpdate({ _id: restaurant._id }, restaurant, { upsert: true })
            } catch (err) {
                throw new Error(err)
            }
        }
    }
}






