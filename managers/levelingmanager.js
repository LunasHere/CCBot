class LevelingManager {
    constructor(client) {
        this.client = client;
        this.client.con.query(`CREATE TABLE IF NOT EXISTS leveling (id VARCHAR(30), xp INT)`, (err) => {
            if (err) console.error(err);
        });            
    }

    // Get the level of a user, each level requires 250xp to level up.
    async getLevel(user) {
        return new Promise((resolve, reject) => {
            this.client.con.query(`SELECT * FROM leveling WHERE id = ?`, [user.id], (err, res) => {
                if (err) {
                    console.error(err);
                    return reject(err);
                }
                if (res.length) {
                    resolve(Math.floor(res[0].xp / 250));
                } else {
                    this.client.con.query(`INSERT INTO leveling (id, xp) VALUES (?, ?)`, [user.id, 0], (err, res) => {
                        if (err) {
                            console.error(err);
                            return reject(err);
                        }
                        resolve(0);
                    });
                }
            });
        });
    }

    // Add xp to a user
    async addXP(user, amount) {
        return new Promise((resolve, reject) => {
            this.client.con.query(`SELECT * FROM leveling WHERE id = ?`, [user.id], (err, res) => {
                if (err) {
                    console.error(err);
                    return reject(err);
                }
                if (res.length) {
                    const newXP = res[0].xp + amount;
                    this.client.con.query(`UPDATE leveling SET xp = ? WHERE id = ?`, [newXP, user.id], (err, res) => {
                        if (err) {
                            console.error(err);
                            return reject(err);
                        }
                        resolve(true);
                    });
                } else {
                    this.client.con.query(`INSERT INTO leveling (id, xp) VALUES (?, ?)`, [user.id, amount], (err, res) => {
                        if (err) {
                            console.error(err);
                            return reject(err);
                        }
                        resolve(true);
                    });
                }
            });
        });
    }

    // Get the xp of a user
    async getXP(user) {
        return new Promise((resolve, reject) => {
            this.client.con.query(`SELECT * FROM leveling WHERE id = ?`, [user.id], (err, res) => {
                if (err) {
                    console.error(err);
                    return reject(err);
                }
                if (res.length) {
                    const xp = res[0].xp % 250;
                    resolve(xp);
                } else {
                    this.client.con.query(`INSERT INTO leveling (id, xp) VALUES (?, ?)`, [user.id, 0], (err, res) => {
                        if (err) {
                            console.error(err);
                            return reject(err);
                        }
                        resolve(0);
                    });
                }
            });
        });
    }

}