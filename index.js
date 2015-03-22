var dust = require('dust')();
var serand = require('serand');

var cdn = serand.configs['autos-images'];

var user;

var update = function (data) {
    var photos = data.photos;
    if (!photos) {
        return;
    }
    var i;
    var length = photos.length;
    for (i = 0; i < length; i++) {
        photos[i] = cdn + photos[i];
    }
    return data;
};

dust.loadSource(dust.compile(require('./template'), 'auto-details'));

module.exports = function (sandbox, fn, options) {
    $.ajax({
        url: '/apis/v/vehicles/' + options.id,
        headers: {
            'x-host': 'autos.serandives.com'
        },
        dataType: 'json',
        success: function (data) {
            dust.render('auto-details', update(data), function (err, out) {
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
