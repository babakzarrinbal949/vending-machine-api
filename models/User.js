class User {
    constructor(username, password, deposit, role) {
        this.username = username;
        this.password = password;
        this.deposit = deposit;
        this.role = role;
        this.token = null;
    }
}

module.exports = User;
