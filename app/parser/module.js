'use strict';

var angular = require('angular');
var app = angular.module('json2csarray.parser', []);

app.controller('parserController', require('./controller'));