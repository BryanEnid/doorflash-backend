"use strict";

var _express = _interopRequireDefault(require("express"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _cors = _interopRequireDefault(require("cors"));

var _consola = _interopRequireDefault(require("consola"));

var _chalk = _interopRequireDefault(require("chalk"));

var _partnerships = _interopRequireDefault(require("./apis/partnerships"));

var _doorDash = _interopRequireDefault(require("./scrapings/doorDash"));

var _config = _interopRequireDefault(require("./database/config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// import types of typescript and modules
// Development Dependecies----
//----------------------------
var app = (0, _express["default"])();
var port = process.env.PORT || 3000; // Middleware are used with app.use()

app.use((0, _cors["default"])());
app.use(_bodyParser["default"].urlencoded({
  extended: true
}));
app.use(_bodyParser["default"].json()); // import APIs

var partnershipsAPI = new _partnerships["default"](app);
partnershipsAPI.initialize();
var doorDash = new _doorDash["default"]();
doorDash.start(); // Server Connection

app.listen(port, function () {
  _consola["default"].success("".concat(_chalk["default"].green('DONE . . . Server   running'), " ").concat(_chalk["default"].blue("Port: ".concat(port))));
}); // Database Connection

var mongodb = new _config["default"]();

mongodb._connect(process.env.DB_HOST);