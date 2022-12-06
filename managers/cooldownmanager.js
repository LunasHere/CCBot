class CooldownManager {
    constructor() {
        this.cooldowns = new Map();
    }

    addCooldown(command, user, time) {
        this.cooldowns.set(`${command}-${user}`, Date.now() + time);
    }

    getCooldown(command, user) {
        return this.cooldowns.get(`${command}-${user}`);
    }

    removeCooldown(command, user) {
        this.cooldowns.delete(`${command}-${user}`);
    }
    
}

module.exports = CooldownManager;