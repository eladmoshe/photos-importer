var fs = require('fs');
var argv = require('optimist').argv;
var _ = require('lodash');

var source = argv._[0];
var target = argv._[1];
var db = {};

function copyFile(source, target, cb) {
    var cbCalled = false;

    function done(err) {
        if (!cbCalled) {
            cb(err);
            cbCalled = true;
        }
    }

    var rd = fs.createReadStream(source);
    rd.on("error", function(err) {
        done(err);
    });
    var wr = fs.createWriteStream(target);
    wr.on("error", function(err) {
        done(err);
    });
    wr.on("close", function(ex) {
        done();
    });
    rd.pipe(wr);
}
function readFiles(err, cb) {
    fs.readdir(source, function(err, files) {
        _(files).forEach(function(file) {
            fs.stat(source + file, function(err, stat) {
                if (!db[stat.mtime]) {
                    db[stat.mtime] = [];
                }
                var bucket = db[stat.mtime];
                bucket.push(source + file);
            });
        });
        cb();
    });

}

readFiles(null, function(){
    console.log(db);
});


console.log('copying from', source, 'to', target);
