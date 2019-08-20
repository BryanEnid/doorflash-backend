"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.partnershipsMenu = exports.partnerships = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var partnershipsSchema = new _mongoose["default"].Schema({
  _id: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    "default": ""
  },
  name: {
    type: String,
    "default": ""
  },
  description: {
    type: String,
    "default": ""
  },
  banner_image: {
    type: String,
    "default": ""
  },
  path: {
    type: String,
    "default": ""
  }
}, {
  collection: "partnerships"
});
var partnershipsMenuSchema = new _mongoose["default"].Schema({
  name: {
    type: String,
    "default": "",
    unique: true
  },
  path: {
    type: String,
    "default": ""
  },
  menu: [{
    title: {
      type: String,
      "default": ""
    },
    description: {
      type: String,
      "default": ""
    },
    price: {
      type: String,
      "default": ""
    },
    banner_image: {
      type: String,
      "default": ""
    }
  }]
}, {
  collection: "partnershipsMenu"
});

var partnerships = _mongoose["default"].model('partnerships', partnershipsSchema);

exports.partnerships = partnerships;

var partnershipsMenu = _mongoose["default"].model('partnershipsMenu', partnershipsMenuSchema);

exports.partnershipsMenu = partnershipsMenu;