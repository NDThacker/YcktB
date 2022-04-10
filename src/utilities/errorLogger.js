const fs = require('fs');

function errorlogger(err, req, res, next) {
	fs.appendFile('../errorlogger.txt', "Error: " + err.message + "\n" +err.stack + "\n", err => {
		if(err) console.log("Error in Logging error " + err);
	})

	if(err.status) {
		res.status(err.status);
		// res.statusCode = err.status;
	}
	else {
		res.status = 500;
	}
	res.json({"error" : err.message});
}

module.exports = errorlogger;