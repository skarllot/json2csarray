'use strict';

var _ = require('lodash');
module.exports = parserController;

parserController.$inject = [];
function parserController() {
    var vm = this;

    vm.typeName = 'TypeName';
    vm.arrayName = 'TypeList';
    vm.jsonInput = '';
    vm.csOutput = '';
    vm.hasOutput = false;
    vm.errorOutput = '';
    vm.hasError = false;
    vm.generate = generate;
    vm.closeError = closeError;
    vm.isReadOnly = true;

    function generate() {
        closeOutput();
        closeError();

        var parsedJson;
        try {
            parsedJson = JSON.parse(vm.jsonInput);
        } catch (e) {
            vm.errorOutput = e;
            vm.hasError = true;
            return;
        }

        if (!_.isArray(parsedJson)) {
            vm.errorOutput = 'The provided JSON is not an array';
            vm.hasError = true;
            return;
        }

        var entry = _.template('\tnew <%= typeName %> {\n<%= fields %>\n\t}');
        var field = _.template('\t\t<%= name %> = <%= value %>');
        var array = _.template('<%= readonly %><%= typeName %>[] <%= arrayName %> =\n{\n<%= elements %>\n};');
        var rfc3339 = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?([+-]\d{2}):(\d{2})$/;

        var entries = [];
        parsedJson.forEach(function (element) {
            var fields = [];
            _.forIn(element, function (value, key) {
                if (value === null)
                    value = "null";
                else if (_.isArray(value))
                    value = 'new byte[] {' + value + '}';
                else if (_.isString(value)) {
                    if (rfc3339.test(value))
                        value = 'RFC3339("' + value + '")';
                    else
                        value = '"' + value + '"';
                }

                fields.push(field({ 'name': key, 'value': value }));
            });
            entries.push(entry({ 'typeName': vm.typeName, 'fields': fields.join(', \n') }));
        });

        var readonlyValue = vm.isReadOnly ? 'readonly ' : '';
        vm.csOutput = array({ 'readonly': readonlyValue, 'typeName': vm.typeName, 'arrayName': vm.arrayName, 'elements': entries.join(', \n') });
        vm.hasOutput = true;
    }

    function closeOutput() {
        vm.hasOutput = false;
        vm.csOutput = '';
    }

    function closeError() {
        vm.hasError = false;
        vm.errorOutput = '';
    }
}
