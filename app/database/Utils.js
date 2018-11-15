const Utils = {
  guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      let r = Math.random() * 16 | 0,
        v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  },

  move(array, fromIndex, toIndex) {
    return array.splice(toIndex, 0, array.splice(fromIndex, 1)[0]);
  },

  findPack(pack, packList) {
    return packList.find(item => item.title.toLowerCase() === pack.title.toLowerCase());
  },

  makeBase64Image(data) {
    return `data:image/png;base64,${data}`;
  },
  makeBase64Audio(data) {
    return `data:audio/mpeg;base64,${data}`;
  },
  makeBase64Video(data) {
    return `data:video/webm;base64,${data}`;
  },
};

module.exports = Utils;
