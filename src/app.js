const bdp = require('body-parser');
const cors = require('cors');
const errorLogger = require('./utilities/errorLogger');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const router = require('./routes/router');
const app = express();

app.use(bdp.json());
app.use(bdp.urlencoded({extended: true}));
app.use(cors());
app.use(helmet());
app.use(morgan('common'));
app.use('/', router);
app.use(errorLogger);
app.listen(process.env.PORT || 1050, () => {
	console.log("Server up and running");
});