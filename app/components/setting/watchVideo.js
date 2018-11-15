import React, { Component } from 'react';
import { View, WebView, Text, Platform } from 'react-native';
import { setPreference } from '@actions/Creators';
import VideoPlayer from 'react-native-video-controls';

import { Styles, Metrics, Colors } from '@theme/';

class WatchVideo extends Component {

    render() {
        return (
            <View style={{ flex: 1, marginLeft: Metrics.doubleBaseMargin }}>
                <Text style={{ color: Colors.titlePrimary, fontWeight: 'bold', fontSize: Metrics.screenWidth / 40, marginTop: Metrics.baseMargin }}>Watch Video</Text>
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
                            style={{ height: 150, marginTop: 10 }}
                        />
                }
            </View>
        );
    }
}
export default WatchVideo;
