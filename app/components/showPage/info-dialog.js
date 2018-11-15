import React from 'react';
import { View, Text, Button } from 'native-base';
import PopupDialog, { SlideAnimation } from 'react-native-popup-dialog';
import { Images, Colors, Metrics, Styles } from '@theme/';
import styles from './styles';
import theme from '../../themes/base-theme';

const InfoText = ({ title, value }) => (
  <View style={styles.infoTextWrapper}>
    <Text numberOfLines={1} style={styles.infoTextTitle}>{title}:</Text>
    <Text numberOfLines={1} style={styles.infoTextValue}>{value}</Text>
  </View>
);
class InfoDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      width: props.width,
      height: null,
    };
  }
  onLayout = ({ nativeEvent }) => {
    this.setState({
      height: nativeEvent.layout.height,
    });
  }
  hasAuthor() {
    const { pack } = this.props;
    return pack.story_author.replace(/\s/g, '') !== '';
  }
  render() {
    const { pack } = this.props;
    let dialogRef;
    return (
      <PopupDialog
        ref={(id) => { dialogRef = id; this.props.onReference(id); }}
        // dialogAnimation={new SlideAnimation({ slideFrom: 'bottom' })}
        width={this.state.width}
        height={this.state.height || 250}
      >
        <View style={styles.infoDialogWrapper} onLayout={this.onLayout}>
          <Text style={[styles.infoDialogTitle, styles.infoTextPadding]}>{`About ${pack.story_name}`}</Text>
          <InfoText title={'Genre'} value={pack.story_genre} />
          {this.hasAuthor() && <InfoText title={'Author'} value={pack.story_author} />}
          <InfoText title={'Artist'} value={pack.story_artist} />
          <Text style={styles.infoDialogDesc}>{pack.story_desc}</Text>
          <View style={styles.infoDialogClose}>
            <Button
              style={[Styles.buttonRadius, styles.dismissButton, { marginRight: -10 }]}
              onPress={() => dialogRef.dismiss()}
            >
              <Text style={styles.infoDialogClose}>Close</Text>
            </Button>
          </View>
        </View>
      </PopupDialog>
    );
  }
}
export default InfoDialog;
