var dust = require('dust')();
var serand = require('serand');
var utils = require('utils');
var Vehicle = require('vehicle-service');

require('gallery');

var user;

dust.loadSource(dust.compile(require('./template'), 'autos-details'));

module.exports = function (sandbox, fn, options) {
    Vehicle.findOne({id: options.id, images: '800x450'}, function (err, vehicle) {
        if (err) {
            return fn(true, serand.none);
        }
        dust.render('autos-details', vehicle, function (err, out) {
            sandbox.append(out);
            if (!fn) {
                return fn(true, serand.none);
            }
            fn(false, {
                clean: function () {
                    $('.autos-details', sandbox).remove();
                },
                done: function () {
                    var i;
                    var o = [];
                    var photos = vehicle.photos;
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
    });
};

serand.on('user', 'ready', function (usr) {
    user = usr;
});

serand.on('user', 'logged in', function (usr) {
    user = usr;
});

serand.on('user', 'logged out', function (usr) {
    user = null;
});
