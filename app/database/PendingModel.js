class PendingModel {
  constructor(pack, account, pendingState, completed) {
    this.pack = pack;
    this.account = account;
    this.pendingState = pendingState || false;
    this.completed = completed || false;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}

module.exports = PendingModel;

