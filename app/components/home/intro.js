import React from 'react';
import { View, Image, Text, WebView } from 'react-native';
import { Button } from 'native-base';
import { Metrics, Images, Styles } from '@theme/';
import styles from '../setting/styles';

class Intro extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showVideo: false,
      promotionalCode: '',
    };
  }
  renderButtons() {
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginTop: Metrics.baseMargin }}>
        {!this.state.showVideo && this.props.connection.toString().toLowerCase() === 'wifi' && <Button
          style={[styles.cancelButton, Styles.buttonRadius]}
          textStyle={styles.cancelButtonText}
          onPress={() => this.setState({ showVideo: true })}
        >
            <Text>VIDEO INTRO</Text>
        </Button>
        }
        <Button
          style={[Styles.buttonRadius, styles.downloadButton]}
          textStyle={styles.downloadButtonText}
          onPress={this.props.onCloseDialog}
        >
            <Text>GET STARTED</Text>
        </Button>
      </View>
    );
  }

  renderRow = text =>
    <View style={{ flexDirection: 'row', paddingRight: 15 }}>
      <Text style={{ fontSize: 20, color: 'grey', paddingRight: 10, lineHeight: 20 }}>•</Text>
      <Text style={{ fontSize: 16, marginBottom: 5 }}>{text}</Text>
    </View>;
  render() {
    return (
      <View style={{ flex: 1, marginLeft: Metrics.doubleBaseMargin, marginRight: Metrics.doubleBaseMargin, marginTop: Metrics.baseMargin, marginBottom: Metrics.baseMargin }}>
        {!this.state.showVideo ?
          <View style={{ flex: 1 }}>
            <Image source={Images.logo} resizeMode={'stretch'} style={styles.headerViewLogo} />
            <View style={{ flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
              <View>
                {this.renderRow('Choose a reading selection.')}
                {this.renderRow(`Enter your child's developmental level.(You can change at any time)`)}
                {this.renderRow('Read, reread, ask, and chat! The conversation starters will help you.')}
              </View>
            </View>
          </View>
        :
          <WebView
            source={{ uri: 'https://player.vimeo.com/video/116451815' }}
            style={{ flex: 1 }}
          />
        }
        {this.renderButtons()}
      </View>
    );
  }
}

export default Intro;
