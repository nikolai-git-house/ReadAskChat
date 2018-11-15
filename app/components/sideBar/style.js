

const React = require('react-native');

const { StyleSheet } = React;

module.exports = StyleSheet.create({
  name: {
    color: '#fff',
    position: 'absolute',
    backgroundColor: 'transparent',
    left: 20,
    fontSize: 14,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 2,
  },
});
