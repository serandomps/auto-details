var dust = require('dust')();
var serand = require('serand');
var utils = require('autos-utils');

require('gallery');

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
            dust.render('auto-details', utils.cdn800x450(data), function (err, out) {
                sandbox.append(out);
                if (!fn) {
                    return;
                }
                fn(false, {
                    clean: function () {
                        $('.auto-details', sandbox).remove();
                    },
                    done: function () {
                        var i;
                        var o = [];
                        var photos = data.photos;
                        var length = photos.length;
                        var photo;
                        for (i = 0; i < length; i++) {
                            photo = photos[i];
                            o.push(photo.url);
                        }
                        blueimp.Gallery(o, {
                            container: $('.blueimp-gallery-carousel', sandbox),
                            carousel: true
                        });
                    }
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
