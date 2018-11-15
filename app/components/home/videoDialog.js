import React, { Component } from 'react';
import { Platform, WebView } from 'react-native';
import PopupDialog from 'react-native-popup-dialog';
import VideoPlayer from 'react-native-video-controls';

class VideoDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            width: props.width,
        };
    }

    render() {
        let dialogRef;
        return (
            <PopupDialog
                ref={(id) => { dialogRef = id; this.props.onReference(id); }}
                closeOnTouchOutside={true}
                width={this.state.width}
                height={200}
            >

                {
                    Platform.OS === 'android' ?
                        <VideoPlayer
                            source={{ uri: 'https://cms.readaskchat.net/videos/welcome.mp4' }}
                            style={{ height: 200, marginTop: 12 }}
                            disableFullscreen={ false }
                        />
                        :
                        <WebView
                            source={{ uri: 'https://player.vimeo.com/video/229298776' }}
                            javaScriptEnabled={true}
                            domStorageEnabled={true}
                            allowsInlineMediaPlayback={true}
                            style={{ height: 200, marginTop: 12 }}
                        />
                }

            </PopupDialog>
        );
    }
}
export default VideoDialog;
