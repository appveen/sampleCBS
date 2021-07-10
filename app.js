const express = require("express");
let app = express();
let port = process.env.PORT || 8080;

const config = require("./config");
const log4js = require("log4js");
log4js.configure(config.logging.options);
let version = require("./package.json").version;
let logger = log4js.getLogger(`[SampleCBS ${version}]`);
logger.level = config.logging.loglevel;
global.logger = logger;

const db = require('./db.client');

app.use(express.json());

let cbsConfig = {
	SLOWNESS: process.env.SLOWNESS || 100,
	STATUS: "Active",
	BALANCE: 100,
	INCR: 0
}


function generateHTMLResponse(){
	let keys = Object.keys(cbsConfig)
	let head = `<html><style type="text/css">body {font-family: monospace;}.container {display: auto;width: 20rem;margin: 2rem 4rem;padding: 1rem;}.center {text-align: center;}p{font-size: x-large;}.key {font-weight:bold;}.value {font-weight: lighter;}</style><body><div class="container"><h1 class="center">Sample CBS</h1>`
	let foot = `</div></body></html>`
	let body = ""
	keys.forEach(key => {
		body += `<p> <span class="key">${key}</span> : <span class="value">${cbsConfig[key]}</span></p>`
	})
	return `${head}${body}${foot}`
}

// ?slow=500&status=[active/inactive]&balance=100&incr=1
app.get("/api/config", (_req, _res) => {
	logger.info(`Config set :: ${JSON.stringify(_req.query)}`);
	cbsConfig.SLOWNESS = _req.query.slow ? parseInt(_req.query.slow) : cbsConfig.SLOWNESS;
	cbsConfig.STATUS = _req.query.status || cbsConfig.STATUS;
	cbsConfig.BALANCE = _req.query.balance ? parseInt(_req.query.balance) : cbsConfig.BALANCE;
	cbsConfig.INCR = _req.query.incr ? parseInt(_req.query.incr) : cbsConfig.INCR;
	logger.info(`SLOWNESS: ${cbsConfig.SLOWNESS}`);
	logger.info(`STATUS :: ${cbsConfig.STATUS}`)
	logger.info(`BALANCE :: ${cbsConfig.BALANCE}`)
	logger.info(`INCR :: ${cbsConfig.INCR}`)
	_res.end(generateHTMLResponse());
});

app.get("/api/balance", (_req, _res) => {
	logger.info(`Balance check :: ${JSON.stringify(_req.query)}`)
	let responsePayload = _req.query
	responsePayload["balance"] = cbsConfig.BALANCE;
	cbsConfig.BALANCE += cbsConfig.INCR
	responsePayload["status"] = cbsConfig.STATUS;
	setTimeout(() => _res.json(responsePayload), cbsConfig.SLOWNESS)
});


(async () => {
	await db.init()
	app.listen(port, () => {
		logger.info("Server started on port " + port)
	})
})();