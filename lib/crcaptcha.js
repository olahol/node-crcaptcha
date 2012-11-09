var http        = require("http"),
    querystring = require("querystring");

var CRC_SERVER     = "captcha.civilrightsdefenders.org",
    CRC_PATH       = "/captchaAPI/",
    CRC_API_SERVER = "http://captcha.civilrightsdefenders.org/captchaAPI/";

exports.show = function (cb) {
    http.get(CRC_API_SERVER, function (res) {
        var body = "";

        res.on("error", function (e) {
            cb(e, null);
        });

        res.on("data", function (chunk) {
            body += chunk;
        });

        res.on("end", function () {
            cb(null, body);
        });

    }).on("error", function (e) {
        cb(e, null);
    });
};

exports.check = function (code, sessid, cb) {
    var qs = querystring.stringify({ "code" : code });

    var options = {
        host: CRC_SERVER,
        path: CRC_PATH,
        port: 80,
        method: "POST",
        headers: {
            "Content-Type" : "application/x-www-form-urlencoded",
            "Content-Length" : qs.length,
            "Cookie" : "PHPSESSID=" + sessid
        }
    };

    var req = http.request(options, function (res) {
        var body = "";

        res.on("error", function (e) {
            cb(e, null);
        });

        res.on("data", function (chunk) {
            body += chunk;
        });

        res.on("end", function() {
            var parts = body.split("\r\n\r\n");
            return cb(null, parts[0] === "true");
        });
    });

    req.write(qs, "utf8");
    req.end();
};
