import React from 'react';
import { View, Text } from 'native-base';
import { TouchableOpacity, Image, Animated, Dimensions, AsyncStorage } from 'react-native';
import PopupDialog, { SlideAnimation } from 'react-native-popup-dialog';
import { Images, Colors, Metrics, Styles } from '@theme/';
import styles from './styles';
import theme from '../../themes/base-theme';
const { height } = Dimensions.get('window');
//Flags
const FLAG_READ_COMPLETED = 'READ_COMPLETED'
const FLAG_CLOSE_COMPLETED = "CLOSE_COMPLETE";
class WelcomeDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            width: props.width,
            height: null,
            isOpen: false,
            readTerms: false,
            close: false,
        };
        if (props.onReference) {
            props.onReference(this);
        }
    }

    onLayout = ({ nativeEvent }) => {
        this.setState({
            height: nativeEvent.layout.height,
        });
    };

    closeDialog() {
        this.setState({
            isOpen: false,
        });

    };
    openDialog() {
        this.setState({
            isOpen: true,
        });
    };

    componentWillMount() {
        AsyncStorage.getItem(FLAG_READ_COMPLETED).then((value) => {
            if (value == "true") {
                this.setState({
                    readTerms: true
                });
                this.closeDialog();
            } else {
                this.setState({
                    readTerms: false
                })
                this.openDialog();
            }
        }).done();

        AsyncStorage.getItem(FLAG_CLOSE_COMPLETED).then((value) => {
            if (value == "true") {
                this.setState({
                    close: true
                });
                this.closeDialog();
            }
        }).done();
    }

    readTermsClick() {
        AsyncStorage.setItem(FLAG_READ_COMPLETED, "true");
        this.props.gotoTermsOfService();
    }

    closeClick() {
        AsyncStorage.setItem(FLAG_CLOSE_COMPLETED, "true");
        this.props.closeWelcome()
    }

    render() {
        return (
            <Animated.View style={[styles.purchaseContainer, { top: this.state.isOpen ? 0 : -height }]}>
                <View style={styles.welcomeDialogWrapper} onLayout={this.onLayout}>
                    <View style={{ borderTopRightRadius: 20, borderTopLeftRadius: 20, borderBottomRightRadius: 0, borderBottomLeftRadius: 0, overflow: 'hidden', borderWidth: 1, borderBottomWidth: 0, borderColor: 'grey' }}>
                        <Image source={Images.welcomeSprite} style={styles.codeConfirmViewLogo} />
                    </View>
                    <View style={styles.welcomeDialogBodyWrapper}>
                        <Text style={[styles.welcomeDialogTitle, { marginTop: 10, fontWeight: '900' }]}>Welcome!</Text>
                        <Text style={styles.welcomeDialogBody}>
                            Click below to learn about our Terms of Service. By continuing to use this app, you are agreeing to these terms.
                        </Text>
                        <TouchableOpacity onPress={() => {this.props.gotoTermsOfService();}}>
                            <Text style={styles.welcomeDialogButton}>Read Terms of Service</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {this.props.closeWelcome()}}>
                            <Text style={styles.welcomeDialogButton}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Animated.View>
        );
    }
}
export default WelcomeDialog;