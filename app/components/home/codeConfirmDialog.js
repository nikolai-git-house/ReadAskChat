import React from 'react';
import { View, Text } from 'native-base';
import {TouchableOpacity, Image, Animated, Dimensions} from 'react-native';
import { Images, Colors, Metrics, Styles } from '@theme/';
import styles from './styles';
import theme from '../../themes/base-theme';
const { height } = Dimensions.get('window');
class CodeConfirmDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            width: props.width,
            height: null,
            isOpen: false,
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

    render() {
        let dialogRef;
        return (
            <Animated.View style={[styles.purchaseContainer, { top: this.state.isOpen ? 0 : -height }]}>
                <View style={styles.welcomeDialogWrapper} onLayout={this.onLayout}>
                    <View style={{ borderTopRightRadius: 20, borderTopLeftRadius: 20, borderBottomRightRadius: 0, borderBottomLeftRadius: 0, overflow: 'hidden', borderWidth: 1, borderBottomWidth: 0, borderColor: 'grey' }}>
                        <Image source={Images.welcomeSprite} style={styles.codeConfirmViewLogo} />
                    </View>
                    <View style={styles.welcomeDialogBodyWrapper}>
                        <Text style={styles.welcomeDialogBody}>
                            Are you using a <Text style={{ fontWeight: 'bold'}}>school</Text>, <Text style={{ fontWeight: 'bold'}}>library</Text>, or <Text style={{ fontWeight: 'bold'}}>organization code</Text>?
                        </Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: 30, marginTop: 10 }}>
                            <View style={{ width: '50%', alignSelf: 'flex-start', alignItems: 'center'}}>
                                <TouchableOpacity onPress={() => {this.props.gotoRegister();}}>
                                    <Text style={[styles.welcomeDialogButton, { fontSize: theme.screenWidth / 40 }]}>YES</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ width: '50%', alignSelf: 'flex-end', alignItems: 'center'}}>
                                <TouchableOpacity onPress={() => {this.props.closeConfirm();}}>
                                    <Text style={[styles.welcomeDialogButton, { fontSize: theme.screenWidth / 40 }]}>NO</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </Animated.View>
        );
    }
}
export default CodeConfirmDialog;
