const fs = require('fs');
const express = require('express');
const hbs = require('hbs');

const config = require('./config/config');

let app = express();

hbs.registerPartials('views/partials');
hbs.registerHelper('getCurrentDate', () => new Date().getFullYear());
hbs.registerHelper('screamIt', text => text.toUpperCase());

app.set('view engine', 'hbs');
// Middlewares
// Order of middlewares is VERY IMPORTANT
// app.use(express.static(__dirname + '/public'));
app.use(
    (req, res, next) => {
        const now = new Date().toString();
        const log = `${now}: ${req.method} ${req.url} \r\n`;
        fs.appendFile('logs/server.log', log, error => {
            if(error) {
                console.log('Unable to write to logs/server.log file ', error);
            }
        });
        next();
    }
);
/* app.use(
    (req, res, next) => {
        res.render('maintenance.hbs');
    }
); */
app.use(express.static(__dirname + '/public'));
// End of middlewares part

app.get('/', (req, res) => {
    res.render('home', {
        currentPage: 'Home Page'
    });
});

app.get('/about', (req, res) => {
    res.render('about', {
        currentPage: 'About Page'
    });
});

app.listen(config.app.port, () => console.log(`Server is running on port ${config.app.port}`));
