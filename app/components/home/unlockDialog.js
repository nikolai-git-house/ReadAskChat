import React from 'react';
import { TouchableOpacity, Image, Animated, Dimensions } from 'react-native';
import { View, Text, Button } from 'native-base';
import { Metrics, Styles, Images } from '@theme/';
import styles from './styles';

const { height } = Dimensions.get('window');

export default class UnlockDialog extends React.Component {
  constructor(props) {
    super(props);
    this.maps = new Map();
    this.state = {
      width: props.width,
      height: null,
      actives: [],
      isOpen: false,
    };

    if (props.reference) {
      props.reference(this);
    }
  }

  componentWillMount() {
    if (this.props.reference) {
      this.props.reference(this);
    }
  }

  onHoldLock = (key) => {
    this.maps.set(key, setTimeout(() => {
      this.setState({ actives: [...this.state.actives, key] }, () => {
        if (this.state.actives.length === this.locks().length) {
          this.props.onUnlock();
        }
      });
    }, 500));
  };

  onReleaseLock = (key) => {
    if (this.maps.has(key)) {
      clearTimeout(this.maps.get(key));
      this.maps.delete(key);
    }
    this.setState({
      actives: this.state.actives.filter(item => item !== key),
    });
  };

  closeDialog = () => {
    this.setState({
      isOpen: false,
    });
  };
  openDialog = () => {
    this.setState({
      isOpen: true,
    });
  };

  locks = (): Array => Array.from(new Array(this.props.totalLocks || 3).keys());

  render() {
    return (
      <Animated.View style={[styles.unlockContainer, { top: this.state.isOpen ? 0 : -height }]}>
        <View style={styles.unlockWrapper}>
          <Text style={styles.titleText}>Parental Gate</Text>
          <Text style={styles.bodyText}>Please verify that you are an adult making this purchase by pressing and holding all three locks simultaneously</Text>
          <View style={styles.lockImageContainer}>
            {this.locks().map(value => (<View
              key={value}
              style={styles.lockImageButton}
              onTouchStart={() => this.onHoldLock(value)}
              onTouchEnd={() => this.onReleaseLock(value)}
            >
              <Image source={Images.lock} style={[styles.lockImage, this.state.actives.includes(value) ? { tintColor: 'green' } : null]} resizeMode="contain" />
            </View>))}
          </View>
          <View style={styles.infoDialogClose}>
            <Button
              style={[Styles.buttonRadius, { width: Metrics.screenWidth / 6, shadowOpacity: 0, justifyContent: 'center' }]}
              onPress={this.closeDialog}
            >
              <Text style={styles.infoDialogClose}>Close</Text>
            </Button>
          </View>
        </View>
      </Animated.View>
    );
  }
}
