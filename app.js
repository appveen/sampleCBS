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

let BALANCE_ENABLE_SLOWNESS = process.env.BALANCE_ENABLE_SLOWNESS || true
let BALANCE_SLOWNESS = process.env.BALANCE_SLOWNESS || 100
let BALANCE_ENABLE_ERROR_ACCOUNTNUMBER = process.env.BALANCE_ENABLE_ERROR_ACCOUNTNUMBER || false
let BALANCE_ENABLE_ERROR_STATUS = process.env.BALANCE_ENABLE_ERROR_STATUS || false
let BALANCE_ENABLE_ERROR_COUNTRY = process.env.BALANCE_ENABLE_ERROR_COUNTRY || false
let BALANCE_ENABLE_ERROR_CURRENCY = process.env.BALANCE_ENABLE_ERROR_CURRENCY || false

process.env.BALANCE_ACCOUNTNUMBER="Error! Invalid account number";
process.env.BALANCE_STATUS="Error! Inactive account number";
process.env.BALANCE_COUNTRY="Error! Country mismatch";
process.env.BALANCE_CURRENCY="Error! Currency mismatch";

// ?enable=true&value=500
app.get("/api/config/balance/slow", (_req, _res) => {
	logger.info(`Set Slowness :: ${JSON.stringify(_req.query)}`);
	BALANCE_ENABLE_SLOWNESS = _req.query.enable && _req.query.enable === 'true';
	BALANCE_SLOWNESS = _req.query.value ? parseInt(_req.query.value) : BALANCE_SLOWNESS;
	logger.info(`BALANCE_ENABLE_SLOWNESS: ${BALANCE_ENABLE_SLOWNESS}`);
	logger.info(`BALANCE_SLOWNESS: ${BALANCE_SLOWNESS}`);
	_res.end();
});

app.get("/api/config/balance/accountnumber", (_req, _res) => {

});

app.get("/api/config/balance", (_req, _res) => {

});

app.get("/api/balance", (_req, _res) => {
	logger.info(`BALANCE_ENABLE_SLOWNESS ::  ${BALANCE_ENABLE_SLOWNESS}`)
	logger.info(_req.query)
	let responsePayload = _req.query
	let status = 200
	if(BALANCE_ENABLE_SLOWNESS) setTimeout(() => _res.status(status).json(responsePayload), BALANCE_SLOWNESS)
	else _res.json(responsePayload)
});


(async () => {
	await db.init()
	app.listen(port, () => {
		logger.info("Server started on port " + port)
	})
})();