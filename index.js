var dust = require('dust')();
var serand = require('serand');
var utils = require('autos-utils');

var user;

dust.loadSource(dust.compile(require('./template'), 'auto-details'));

module.exports = function (sandbox, fn, options) {
    $.ajax({
        url: '/apis/v/vehicles/' + options.id,
        headers: {
            'x-host': 'autos.serandives.com'
        },
        dataType: 'json',
        success: function (data) {
            dust.render('auto-details', utils.cdn(data), function (err, out) {
                sandbox.append(out);
                if (!fn) {
                    return;
                }
                fn(false, function () {
                    $('.auto-details', sandbox).remove();
                });
            });
        },
        error: function () {
            fn(true, function () {

            });
        }
    });
};

serand.on('user', 'logged in', function (usr) {
    user = usr;
});
