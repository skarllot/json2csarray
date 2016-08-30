'use strict';

var _ = require('lodash');
module.exports = parserController;

parserController.$inject = [];
function parserController() {
    var vm = this;

    vm.jsonInput = '';
    vm.csOutput = '';
    vm.hasOutput = false;
    vm.generate = generate;
    vm.closeOutput = closeOutput;
    
    function generate() {
        var parsedJson = JSON.parse(vm.jsonInput);
        if (!_.isArray(parsedJson))
            return;
        
        var entry = _.template('\tnew TypeName {\n<%= fields %>\n\t}');
        var field = _.template('\t\t<%= name %> = <%= value %>');
        var array = _.template('readonly TypeName[] TypeList =\n{\n<%= elements %>\n}');
        
        var entries = [];
        parsedJson.forEach(function(element) {
            var fields = [];
            _.forIn(element, function(value, key) {
                if (_.isString(value))
                    value = '"' + value + '"';
                
                fields.push(field({'name' : key, 'value' : value}));
            });
            entries.push(entry({'fields' : fields.join(', \n')}));
        });
        
        vm.csOutput = array({'elements' : entries.join(', \n')});
        vm.hasOutput = true;
    }
    
    function closeOutput() {
        vm.hasOutput = false;
        vm.csOutput = '';
    }
}
