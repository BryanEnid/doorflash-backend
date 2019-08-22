"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _config = _interopRequireDefault(require("../database/config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var PartnershipsAPI =
/*#__PURE__*/
function () {
  function PartnershipsAPI(app) {
    _classCallCheck(this, PartnershipsAPI);

    _defineProperty(this, "app", void 0);

    _defineProperty(this, "initialized", void 0);

    _defineProperty(this, "partnershipsDB", void 0);

    _defineProperty(this, "partnershipsMenuDB", void 0);

    this.app = app;
    this.initialized = false;
    this.partnershipsDB = new _config["default"]().partnerships;
    this.partnershipsMenuDB = new _config["default"]().partnershipsMenu;
  }

  _createClass(PartnershipsAPI, [{
    key: "initialize",
    value: function initialize() {
      if (this.initialized !== true) {
        this.initialized = true; //API initialize

        this.getData();
      } else {
        throw new Error('"partnershipAPI" is already initialized, please don\'t initialize more than once.');
      }
    }
  }, {
    key: "getData",
    value: function getData() {
      var _this = this;

      this.app.get("/partnerships/",
      /*#__PURE__*/
      function () {
        var _ref = _asyncToGenerator(function* (req, res) {
          var document = yield _this.partnershipsDB.find();
          res.send(document);
        });

        return function (_x, _x2) {
          return _ref.apply(this, arguments);
        };
      }());
      this.app.get("/partnerships/:name",
      /*#__PURE__*/
      function () {
        var _ref2 = _asyncToGenerator(function* (req, res) {
          var doc = yield _this.partnershipsDB.find({
            name: req.params.name
          });
          doc.length != 0 ? res.send(doc) : res.status(404).send({
            error: {
              message: "".concat(req.originalUrl, " was not found"),
              success: false,
              status: 404
            }
          });
        });

        return function (_x3, _x4) {
          return _ref2.apply(this, arguments);
        };
      }());
      this.app.get("/partnerships/:name/menu?",
      /*#__PURE__*/
      function () {
        var _ref3 = _asyncToGenerator(function* (req, res) {
          try {
            var _req$query = req.query,
                limit = _req$query.limit,
                skip = _req$query.skip;
            limit = parseInt(limit) || 10;
            skip = parseInt(skip) || 0;
            var docElementsCount = yield _this.partnershipsMenuDB.aggregate([{
              $match: {
                name: req.params.name
              }
            }, {
              $unwind: "$menu"
            }, {
              $count: "__v"
            }]);
            var elementsCount = docElementsCount[0].__v;
            var pages = Math.ceil(elementsCount / limit);
            var actualPage = Math.ceil((skip + limit) / limit);

            if (skip % limit != 0) {
              actualPage = false;
            }

            if (actualPage > pages || !actualPage) {
              if (actualPage) {
                res.send({
                  success: false,
                  error: {
                    message: "Not found - Try another query options",
                    limit: limit,
                    skip: skip,
                    success: false,
                    status: 404,
                    actualPage: false
                  }
                });
              } else {
                res.send({
                  actualPage: false
                });
              }
            } else {
              var doc = yield _this.partnershipsMenuDB.find({
                name: req.params.name
              }, {
                menu: {
                  $slice: [skip, limit]
                }
              }).lean();
              doc[0].pagination = {
                elementsCount: elementsCount,
                pages: pages,
                skip: skip,
                limit: limit,
                actualPage: actualPage
              };
              doc[0].success = true;
              doc.length != 0 ? res.send.apply(res, _toConsumableArray(doc)) : res.status(404).send({
                success: false,
                error: {
                  message: "".concat(req.originalUrl, " was not found"),
                  success: false,
                  status: 404
                }
              });
            }
          } catch (err) {
            res.status(404).send({
              error: {
                message: "".concat(req.originalUrl, " was not found"),
                success: false,
                status: 404
              }
            });
          }
        });

        return function (_x5, _x6) {
          return _ref3.apply(this, arguments);
        };
      }());
      this.app.get('/partnerships/*', function (req, res) {
        res.status(404).send({
          error: {
            message: "".concat(req.originalUrl, " was not found"),
            success: false,
            status: 404
          }
        });
      });
    }
  }]);

  return PartnershipsAPI;
}();

exports["default"] = PartnershipsAPI;