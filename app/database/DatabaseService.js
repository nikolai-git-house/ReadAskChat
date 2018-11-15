import Realm from 'realm';

const repository = new Realm({
  schema: [{
    name: 'Account',
    primaryKey: 'email',
    properties: {
      email: { type: 'string', indexed: true },
    },
  },
  {
    name: 'Pack',
    primaryKey: 'id',
    properties: {
      id: { type: 'string', indexed: true },
      title: 'string',
      pack_id: 'int',
      language: 'string',
      completed: 'bool',
      createdAt: 'date',
      updatedAt: 'date',
      availableFor: { type: 'list', objectType: 'Account' },
      availableForLength: { type: 'int', default: 0 },
    },
  },
  {
    name: 'Pending',
    primaryKey: 'pack',
    properties: {
      pack: { type: 'int', indexed: true },
      account: 'string',
      pendingState: 'bool',
      completed: 'bool',
      createdAt: 'date',
      updatedAt: 'date',
    },
  }],
  schemaVersion: 7,
  migration: (oldRealm, newRealm) => {
    if (oldRealm.schemaVersion < 2) {
      const oldPacks = oldRealm.objects('Pack');
      const newPacks = newRealm.objects('Pack');
      for (let i = 0; i < oldPacks.length; i += 1) {
        const pack = JSON.parse(oldPacks[i].title);
        const hasLanguage = !!pack.language;
        if (hasLanguage) {
          newPacks[i].language = pack.language;
        }
      }
    }
    if (oldRealm.schemaVersion < 3) {
      const oldPacks = oldRealm.objects('Pack');
      const newPacks = oldRealm.objects('Pack');
      for (let i = 0; i < oldPacks.length; i += 1) {
        const pack = JSON.parse(oldPacks[i].title);
        const hasLanguage = !!pack.language;
        if (hasLanguage) {
          newPacks[i].pack_id = pack.pack_id;
        }
      }
    }
    if (oldRealm.schemaVersion < 4) {

    }
    if (oldRealm.schemaVersion < 5) {
      const oldPacks = oldRealm.objects('Pack');
      const newPacks = oldRealm.objects('Pack');
      for (let i = 0; i < oldPacks.length; i += 1) {
        const pack = JSON.parse(oldPacks[i].title);
        const hasLanguage = !!pack.language;
        if (hasLanguage) {
          newPacks[i].availableFor = [];
        }
      }
    }
    if (oldRealm.schemaVersion < 7) {
      const oldPacks = oldRealm.objects('Pack');
      const newPacks = oldRealm.objects('Pack');
      for (let i = 0; i < oldPacks.length; i += 1) {
        const pack = JSON.parse(oldPacks[i].title);
        const hasLanguage = !!pack.language;
        if (hasLanguage) {
          newPacks[i].availableForLength = 0;
        }
      }
    }
  },
});

const DatabaseService = {
  findAll(email, sortBy) {
    const filters = [];
    filters.push(`(availableForLength == 0 or (availableForLength > 0 and availableFor.email == '${email}'))`);
    if (!sortBy) sortBy = [['completed', false], ['updatedAt', true]];
    return repository.objects('Pack').filtered(filters.join(' and ')).sorted(sortBy);
  },
  findPackById(id) {
    return repository.objects('Pack').filtered(`pack_id = '${id}'`);
  },
  findAllByLanguage(email, language = 'en', sortBy = null) {
    let filters = [];
    if (!sortBy) sortBy = [['completed', false], ['updatedAt', true]];
    if (language !== 'll') filters.push(`language = '${language.toUpperCase()}'`);
    let data = repository.objects('Pack');
    filters.push(`(availableForLength == 0 or (availableForLength > 0 and availableFor.email == '${email}'))`);
    if (filters.length > 0) {
      data = data.filtered(filters.join(' and '));
    }
    return data.sorted(sortBy);
  },
  findEmail(email) {
    return repository.objects('Account').filtered(`email = '${email}'`);
  },
  findAllPending(sortBy) {
    if (!sortBy) sortBy = [['completed', false], ['updatedAt', true]];
    return repository.objects('Pending').sorted(sortBy);
  },
  save(pack) {
    // pack.title = pack.title.replace(/([']+)/gm, '&#39;');
    const existingPack = repository.objects('Pack').filtered(`pack_id = '${pack.pack_id}'`);
    let objectPack;
    if (existingPack.length > 0) {
      objectPack = existingPack[0];
      return repository.write(() => {
        objectPack.availableFor.push(pack.availableFor[0]);
        objectPack.availableForLength = objectPack.availableFor.length;
      });
    }
    objectPack = pack;
    return repository.write(() => {
      objectPack.updatedAt = new Date();
      repository.create('Pack', objectPack);
    });
  },
  savePending(data) {
    if (!repository.objects('Pending').isValid()) {
      return;
    }
    if (repository.objects('Pending').filtered(`pack = '${data.pack}'`).length) return;
    repository.write(() => {
      data.updatedAt = new Date();
      repository.create('Pending', data);
    });
  },
  updatePack(packid, pack) {
    repository.write(() => {
      repository.create('Pack', { id: packid.toString(), title: pack }, true);
    });
  },
  updatePending(packid) {
    repository.write(() => {
      repository.create('Pending', { pack: packid, pendingState: true }, true);
    });
  },

  delete(data, email) {
    if (!repository.objects('Pack').isValid()) {
      return;
    }
    const pack = repository.objects('Pack').filtered(`pack_id = '${data.pack_id}'`)[0];
    let newAvailableFor = [];
    if (!pack) {
      return;
    }
    if (pack.availableFor.length > 0) {
      newAvailableFor = newAvailableFor.concat(...pack.availableFor).filter(account => account.email !== email);
    }
    try {
      repository.write(() => {
        if (newAvailableFor.length > 0) {
          pack.availableFor = newAvailableFor;
          pack.availableForLength = newAvailableFor.length;
        } else {
          repository.delete(pack);
        }
      });
    } catch (e) {
      console.log('error on deleting');
    }
  },
  deletePending(data) {
    repository.write(() => {
      const pending = repository.objects('Pending').filtered(`id = '${data.id}'`);
      repository.delete(pending);
    });
  },
  deleteAll() {
    repository.write(() => {
      repository.deleteAll();
    });
  },
};


module.exports = DatabaseService;
