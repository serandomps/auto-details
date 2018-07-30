var dust = require('dust')();
var serand = require('serand');
var utils = require('utils');
var Vehicle = require('vehicles-service');

require('gallery');

var user;

dust.loadSource(dust.compile(require('./template'), 'vehicles-findone'));

module.exports = function (sandbox, options, done) {
    Vehicle.findOne({id: options.id, images: '800x450'}, function (err, vehicle) {
        if (err) {
            return done(err);
        }
        if (user.id === vehicle.user) {
            vehicle._ = {
                edit: true
            }
        }
        console.log(user)
        console.log(vehicle)
        dust.render('vehicles-findone', vehicle, function (err, out) {
            if (err) {
                return done(err);
            }
            sandbox.append(out);
            done(null, {
                clean: function () {
                    $('.vehicles-findone', sandbox).remove();
                },
                ready: function () {
                    var i;
                    var o = [];
                    var photos = vehicle.photos;
                    var length = photos.length;
                    var photo;
                    for (i = 0; i < length; i++) {
                        photo = photos[i];
                        o.push({
                            href: photo.url,
                            thumbnail: photo.url
                        });
                    }
                    blueimp.Gallery(o, {
                        container: $('.blueimp-gallery-carousel', sandbox),
                        carousel: true,
                        thumbnailIndicators: true,
                        stretchImages: true
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
