import Account from './Account';

class PackModel {
  constructor(packid, title, completed, accounts) {
    const pack = JSON.parse(title);
    this.id = packid.toString();
    this.pack_id = pack.pack_id;
    this.title = title;
    this.language = pack.language || 'en';
    this.completed = completed || false;
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.availableFor = accounts.map(email => Account.findOrCreate(email));
    this.availableForLength = accounts.length;
  }
}

module.exports = PackModel;
