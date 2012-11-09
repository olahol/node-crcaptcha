var express = require("express")
    , http = require("http")
    , crc = require("../lib/crcaptcha");

var app = express();

app.configure(function(){
    app.set("port", process.env.PORT || 3000);
    app.set("views", __dirname + "/views");
    app.set("view engine", "jade");
    app.use(express.favicon());
    app.use(express.logger("dev"));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
});

app.configure("development", function(){
    app.use(express.errorHandler());
});

app.get("/", function(req, res) {
    crc.show(function (err, html) {
        if (err) {
            console.log(err);
        } else {
            res.render("form", { captcha: html });
        }
    });
});

app.post("/", function (req, res) {
    crc.check(req.body.crc_captcha, req.body.crc_sessid, function (err, success) {
        if (err) {
            console.log(err);
        } else {
            if (success) {
                res.send("Right.");
            } else {
                res.send("Wrong.");
            }
        }
    });
});

http.createServer(app).listen(app.get("port"), function(){
    console.log("Express server listening on port " + app.get("port"));
});
