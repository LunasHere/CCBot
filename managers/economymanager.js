// Create a class for economy manager
class EconomyManager {
    // This function is called when the manager is initialized
    constructor(client) {
        this.client = client;
        this.client.con.query('CREATE TABLE IF NOT EXISTS `economy` (`user_id` VARCHAR(255), `balance` INT(11))', (err) => {
            if (err) console.error(err);
        });
    }

    // This function is called when a user needs to be fetched from the database.
    async getBalance(user) {
        return new Promise((resolve, reject) => {
            // Get the balance of the user
            this.client.con.query('SELECT * FROM `economy` WHERE `user_id`', [user.id], (err, res) => {
                if (err) {
                    console.error(err);
                    return reject(err);
                }
                if (res.length) {
                    resolve(res[0].balance);
                } else {
                    this.client.con.query('INSERT INTO `economy` (`user_id`, `balance`) VALUES (?,?)', [user.id, 0], (err, res) => {
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

    // This function is called when a user's balance needs to be updated in the database.
    async updateBalance(user, newBalance) {
        return new Promise((resolve, reject) => {
            this.client.con.query('UPDATE `economy` SET `balance` = ? WHERE `user_id` = ?', [newBalance, user.id], (err, res) => {
                if (err) {
                    console.error(err);
                    return reject(err);
                }
                resolve(true);
            });
        });
    }

    // This function is called when a user's balance needs to be added to in the database.
    async addBalance(user, amount) {
        return new Promise((resolve, reject) => {
            // Get the balance of the user
            this.client.con.query('SELECT * FROM `economy` WHERE `user_id` = ?', [user.id], (err, res) => {
                if (err) {
                    console.error(err);
                    return reject(err);
                }
                if (res.length) {
                    const newBalance = res[0].balance + amount;
                    this.client.con.query('UPDATE `economy` SET `balance` = ? WHERE `user_id` = ?', [newBalance, user.id], (err, res) => {
                        if (err) {
                            console.error(err);
                            return reject(err);
                        }
                        resolve(true);
                    });
                } else {
                    this.client.con.query('INSERT INTO `economy` (`user_id`, `balance`) VALUES (?,?)', [user.id, amount], (err, res) => {
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

    // This function is called when a user's balance needs to be removed from in the database.
    async removeBalance(user, amount) {
        return new Promise((resolve, reject) => {
            // Get the balance of the user
            this.client.con.query('SELECT * FROM `economy` WHERE `user_id` = ?', [user.id], (err, res) => {
                if (err) {
                    console.error(err);
                    return reject(err);
                }
                if (res.length) {
                    const newBalance = res[0].balance - amount;
                    this.client.con.query('UPDATE `economy` SET `balance` = ? WHERE `user_id` = ?', [newBalance, user.id], (err, res) => {
                        if (err) {
                            console.error(err);
                            return reject(err);
                        }
                        resolve(true);
                    });
                } else {
                    this.client.con.query('INSERT INTO `economy` (`user_id`, `balance`) VALUES (?,?)', [user.id, 0], (err, res) => {
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

}

module.exports = EconomyManager;