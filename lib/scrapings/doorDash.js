"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _puppeteer = _interopRequireDefault(require("puppeteer"));

var _nodeSchedule = _interopRequireDefault(require("node-schedule"));

var _config = _interopRequireDefault(require("../database/config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// import { restaurants } from "../interfaces/doorDash"
var DoorDash = function DoorDash() {
  var _this = this;

  _classCallCheck(this, DoorDash);

  _defineProperty(this, "URI", "https://www.doordash.com");

  _defineProperty(this, "partnershipsDB", new _config["default"]().partnerships);

  _defineProperty(this, "partnershipsMenuDB", new _config["default"]().partnershipsMenu);

  _defineProperty(this, "restaurants", []);

  _defineProperty(this, "scrappedRestaurants", []);

  _defineProperty(this, "start", function () {
    console.log("Initialized");

    _this.scrappeWithPuppeteer();

    _this.updateAPIDaily();
  });

  _defineProperty(this, "updateAPIDaily", function () {
    _nodeSchedule["default"].scheduleJob('* * 7 * * *', function () {
      _this.scrappeWithPuppeteer();
    });
  });

  _defineProperty(this, "scrappeWithPuppeteer",
  /*#__PURE__*/
  _asyncToGenerator(function* () {
    console.log("Scrapping...");
    var browser = yield _puppeteer["default"].launch({
      headless: true,
      devtools: true,
      defaultViewport: null,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    var page = yield browser.newPage();
    yield page["goto"]("".concat(_this.URI, "/consumer/login/")); //Login in doordash

    yield page.type("#login-form input[type=email]", "".concat(process.env.DD_USER));
    yield page.type("#login-form input[type=password]", "".concat(process.env.DD_PSWD));
    yield page.click('button[type=submit]');
    yield page.waitForNavigation(); //Get Top Restaurant

    yield page["goto"]("".concat(_this.URI, "/categories/282/"));
    yield page.waitForSelector("[data-anchor-id=StoreCard]");
    yield _this.getRestaurantsData(page, browser);
    yield page["goto"]("".concat(_this.URI, "/categories/18440/"));
    yield page.waitForSelector("[data-anchor-id=StoreCard]");
    yield _this.getRestaurantsData(page, browser);
    yield _this.getRestaurantsMenu(page);
    yield browser.close(); // Save scrapped data to Database

    _this.saveFetchedDataToDatabase(_this.scrappedRestaurants);
  }));

  _defineProperty(this, "getRestaurantsData",
  /*#__PURE__*/
  function () {
    var _ref2 = _asyncToGenerator(function* (page, browser) {
      console.log("Getting Restaurants data...");
      _this.restaurants = yield page.evaluate(function () {
        return Array.from(document.querySelectorAll("[data-anchor-id=StoreCard]")).map(function (item) {
          var _item$lastChild$child = item.lastChild.children[0].childNodes,
              title = _item$lastChild$child[0],
              description = _item$lastChild$child[1],
              x = _item$lastChild$child[2];
          var path = item.pathname;
          var store_id = Number(item.dataset.storeId);
          if (title) title = title.textContent;
          if (description) description = description.textContent;
          var removeSpace = title.replace(/ /g, "_");
          var removeSimbols = removeSpace.replace(/\'/g, "");
          var removeSimbols2 = removeSimbols.replace(/\®/g, "");
          var name = removeSimbols2.toLowerCase();
          return {
            title: title,
            name: name,
            description: description,
            path: path,
            _id: store_id
          };
        });
      });
      var logosPage = yield browser.newPage();

      for (var i = 0; i < _this.restaurants.length; i++) {
        yield logosPage["goto"]("https://worldvectorlogo.com/search/".concat(_this.restaurants[i].title));
        yield logosPage.waitForSelector(".logo__img");
        _this.restaurants[i].banner_image = yield logosPage.evaluate(function () {
          var image = document.querySelectorAll(".logo__img")[0];
          return image.src;
        });
      }

      logosPage.close();
    });

    return function (_x, _x2) {
      return _ref2.apply(this, arguments);
    };
  }());

  _defineProperty(this, "getRestaurantsMenu",
  /*#__PURE__*/
  function () {
    var _ref3 = _asyncToGenerator(function* (page) {
      console.log("Getting Restaurants menu...");

      for (var i = 0; i < _this.restaurants.length; i++) {
        var item = _this.restaurants[i];
        var path = item.path;
        yield page["goto"]("".concat(_this.URI).concat(path));
        yield page.waitForSelector("[data-anchor-id=MenuItem]");
        var menu = yield page.evaluate(function () {
          return Array.from(document.querySelectorAll("[data-anchor-id=MenuItem]")).map(function (item) {
            var _item$children$0$chil = item.children[0].children[0].children[0].children[0].children[0].children[0].childNodes,
                data = _item$children$0$chil[0],
                banner_image = _item$children$0$chil[1];
            var _data$childNodes = data.childNodes,
                title = _data$childNodes[0],
                description = _data$childNodes[1],
                price = _data$childNodes[2];
            if (!title) title = "";
            if (!description) description = "";
            if (!price) price = "";
            if (!banner_image) banner_image = "";
            if (title) title = title.textContent;
            if (description) description = description.textContent;
            if (price) price = price.textContent;

            if (banner_image) {
              var regex = /https:(.*?).jpg/gm;
              var arr;
              var str = banner_image.children[0].children[0].children[1].srcset;
              var result;

              while ((arr = regex.exec(str)) !== null) {
                result = arr[0];
              }

              banner_image = result;
            }

            return {
              title: title,
              description: description,
              price: price,
              banner_image: banner_image
            };
          });
        });
        if (!menu) console.log(menu);
        item.menu = menu;

        _this.scrappedRestaurants.push(item);
      }
    });

    return function (_x3) {
      return _ref3.apply(this, arguments);
    };
  }());

  _defineProperty(this, "saveFetchedDataToDatabase",
  /*#__PURE__*/
  function () {
    var _ref4 = _asyncToGenerator(function* (restaurants) {
      console.log("Saving to Database...");

      for (var i = 0; i < restaurants.length; i++) {
        var restaurant = restaurants[i];
        var restaurantMenu = restaurants[i].menu;

        try {
          yield _this.partnershipsMenuDB.findOneAndUpdate({
            name: restaurant.name
          }, {
            name: restaurant.name,
            menu: restaurantMenu
          }, {
            upsert: true
          });
          delete restaurant.menu;
          yield _this.partnershipsDB.findOneAndUpdate({
            _id: restaurant._id
          }, restaurant, {
            upsert: true
          });
        } catch (err) {
          throw new Error(err);
        }
      }
    });

    return function (_x4) {
      return _ref4.apply(this, arguments);
    };
  }());
};

exports["default"] = DoorDash;