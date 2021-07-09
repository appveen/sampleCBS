const path = require("path")
const config = require('dotenv').config({ path: path.join(__dirname, 'config.env') })
const mongodb = require("mongodb")

module.exports = {
	"db": {
		"MONGOURL": process.env.MONGOURL,
		"DB_NAME": process.env.DB_NAME,
		"clinetOptions": {
			"readPreference": mongodb.ReadPreference.SECONDARY_PREFERRED,
			"useUnifiedTopology": true
		}
	},
	"logging": {
		"loglevel": process.env.LOG_LEVEL || "info",
		"options": {
			"appenders": {
				"out": {
					"type": 'stdout',
					"layout": { type: 'basic' }
				}
			},
			"categories": {
				"default": {
					"appenders": ['out'],
					"level": 'error'
				}
			}
		}
	}
}