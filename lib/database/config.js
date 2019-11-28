"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _partnerships = require("./schemas/partnerships");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Database = function Database() {
  _classCallCheck(this, Database);

  _defineProperty(this, "partnerships", _partnerships.partnerships);

  _defineProperty(this, "partnershipsMenu", _partnerships.partnershipsMenu);

  _defineProperty(this, "db", _mongoose["default"].connection);

  _defineProperty(this, "_connect",
  /*#__PURE__*/
  function () {
    var _ref = _asyncToGenerator(function* (DB_HOST) {
      try {
        _mongoose["default"].connect("".concat(DB_HOST, "/").concat(process.env.DB_NAME), {
          useNewUrlParser: true,
          useCreateIndex: true,
          useFindAndModify: false
        });

        console.log("DONE . . . Database running on ".concat(DB_HOST, "/").concat(process.env.DB_NAME).concat(process.env.DB_PARAMETERS));
      } catch (_unused) {
        console.log("database not connected");
      }
    });

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }());
};

exports["default"] = Database;