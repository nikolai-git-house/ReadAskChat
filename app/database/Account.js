import database from './DatabaseService';

class Account {
  constructor(email) {
    this.email = email;
  }
  static findOrCreate(email) {
    const findEmail = database.findEmail(email);
    if (findEmail.length > 0) {
      return findEmail[0];
    }
    return new Account(email);
  }
}

module.exports = Account;
