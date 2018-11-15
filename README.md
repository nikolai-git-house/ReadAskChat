# ReadAskChat by React Native

## Initial Install
Install Prerequisites:
 - [Node.js](https://nodejs.org)
 - [React Native CLI](https://www.npmjs.com/package/react-native-cli)
 - [Yarn](https://yarnpkg.com/)

## Initialize environment

Clone this repository:
```
$ git clone git@bitbucket.org:csgerber/proracrn.git
$ cd proracrn/
```

Initialize the environment
```
$ yarn install
$ cd ios
$ pod install
$ cd ..
```

Run the application
```
$ react-native start
$ react-native run-ios
```


## How to clear and rerun the application

```
$ rm -rf node_modules/
$ yarn clean cache & yarn install
$ react-native start --reset-cache
$ react-native run-ios
```