var express = require('express');
var app = express();

var users = [];

app.use((req, res, next) => {
    // console.log(JSON.stringify(req));
    next();
})

app.use(express.static('client'));


app.get('/getScore', function (req, res) {
    res.json(users);
});

app.post('/setScore', function (req, res) {
    users.concat(JSON.parse(req));
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
    //
});
