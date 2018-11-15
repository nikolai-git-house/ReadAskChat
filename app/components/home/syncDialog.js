import React from 'react';
import { View, Text } from 'react-native';
import { Button } from 'native-base';
import * as Progress from 'react-native-progress';

import { Metrics, Styles } from '@theme/';
import styles from '../setting/styles';
import { scaleByVertical, scale } from '../../scaling/utils';


class syncDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showVideo: false,
      promotionalCode: '',
    };
  }
  render() {
    const { isDownloading, progress, onSubmit, onDismiss } = this.props;
    return (
      <View style={{ flex: 1, marginLeft: Metrics.doubleBaseMargin, marginRight: Metrics.doubleBaseMargin, marginTop: Metrics.baseMargin, marginBottom: Metrics.baseMargin }}>
        <View style={{ flex: 1, alignItems: 'flex-start' }}>
          <Text style={{ fontSize: scaleByVertical(22), color: 'rgba(0,0,0,0.7)' }}>Download Packs</Text>
          <Text style={{ fontSize: scaleByVertical(12), color: '#212121', marginTop: Metrics.smallMargin }}>Welcome to ReadAskChat. Download available story packs to this device?</Text>
          {isDownloading && <View style={{ alignSelf: 'center', alignItems: 'center' }}>
            <Progress.Bar
              progress={progress}
              width={Metrics.cellWidth}
              height={Metrics.baseMargin}
              borderRadius={0}
              style={{ marginTop: Metrics.baseMargin }}
            />
            <Text style={{ textAlign: 'center' }}>{`${Math.round(this.props.progress * 100)}%`}</Text>
          </View>}
        </View>

        <View style={{ height: Metrics.screenHeight * 0.1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginTop: 5 }}>
          <Button
            style={[Styles.buttonRadius, styles.cancelButton]}
            onPress={onDismiss}
            textStyle={styles.cancelButtonText}
          >
            <Text>Dismiss</Text>
          </Button>
          <Button
            style={[Styles.buttonRadius, styles.downloadButton]}
            onPress={onSubmit}
            disabled={isDownloading}
          >
            <Text style={styles.downloadButtonText}>Download</Text>
          </Button>
        </View>
      </View>
    );
  }
}

export default syncDialog;
