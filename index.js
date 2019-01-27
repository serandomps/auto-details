var dust = require('dust')();
var serand = require('serand');
var utils = require('utils');
var Vehicle = require('vehicles-service');

require('gallery');

var user;

dust.loadSource(dust.compile(require('./template'), 'vehicles-findone'));

module.exports = function (ctx, container, options, done) {
    var sandbox = container.sandbox;
    Vehicle.findOne({id: options.id, images: '800x450'}, function (err, vehicle) {
        if (err) {
            return done(err);
        }
        if (user.id === vehicle.user) {
            vehicle._.edit = true;
        }
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
                    var images = vehicle._.images;
                    var length = images.length;
                    var image;
                    for (i = 0; i < length; i++) {
                        image = images[i];
                        o.push({
                            href: image.url,
                            thumbnail: image.url
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
