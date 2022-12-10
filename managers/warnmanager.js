const { resolveColor } = require("discord.js");

class WarnManager {
    constructor(client) {
        this.client = client;
        this.client.con.query(`CREATE TABLE IF NOT EXISTS warnings (caseid INT(10), user TEXT, warnedby TEXT, reason TEXT, date TEXT)`);
    }

    // Get the number of warnings a user has
    async getNumOfWarns(user) {
        return new Promise((resolve, reject) => {
            this.client.con.query(`SELECT * FROM warnings WHERE user = '${user.id}'`, (err, result) => {
                if (err) {
                    console.error(err);
                    return reject(err);
                }
                resolve(result.length);
            });
        });
    }

    // Add a warning to a user
    async addWarn(user, by, reason) {
        return new Promise((resolve, reject) => {
            this.client.con.query(`SELECT * FROM warnings`, (err, result) => {
                if (err) {
                    console.error(err);
                    return reject(err);
                }
                let caseid = Math.floor(100000 + Math.random() * 900000);
                while (result.find(warn => warn.caseid === caseid)) caseid = Math.floor(100000 + Math.random() * 900000);
                const date = new Date().toLocaleString('en-US', {
                    weekday: 'short', // long, short, narrow
                    day: 'numeric', // numeric, 2-digit
                    year: 'numeric', // numeric, 2-digit
                    month: 'long', // numeric, 2-digit, long, short, narrow
                    hour: '2-digit', // numeric, 2-digit
                    minute: '2-digit' // numeric, 2-digit
                });
                this.client.con.query(`INSERT INTO warnings (caseid, user, warnedby, reason, date) VALUES (${caseid}, '${user.id}', '${by.username} (${by.id})', '${reason}', '${date + " CST"}')`, (err, result) => {
                    if (err) {
                        console.error(err);
                        return reject(err);
                    }
                    resolve(caseid);
                });
            });
        });
    }

    // Get a warning for a user by caseid
    async getWarn(caseid) {
        return new Promise((resolve, reject) => {
            this.client.con.query(`SELECT * FROM warnings WHERE caseid = ${caseid}`, (err, result) => {
                if (err) {
                    console.error(err);
                    return reject(err);
                }
                // If the warning doesn't exist, return null
                if (!result[0]) return resolve(null);
                resolve(result[0]);
            });
        });
    }

    // Remove a warning for a user by caseid
    async removeWarn(caseid) {
        return new Promise((resolve, reject) => {
            this.client.con.query(`DELETE FROM warnings WHERE caseid = ${caseid}`, (err, result) => {
                if (err) {
                    console.error(err);
                    return reject(err);
                }
                resolve(true);
            });
        });

    }

    // Get all warnings for a user
    async getWarnsForUser(user) {
        return new Promise((resolve, reject) => {
            this.client.con.query(`SELECT * FROM warnings WHERE user = '${user.id}'`, (err, result) => {
                if (err) {
                    console.error(err);
                    return reject(err);
                }
                resolve(result);
            });
        });
    }

}

module.exports = WarnManager;