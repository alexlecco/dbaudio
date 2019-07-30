import React, {Component} from 'react';
import {
  TouchableOpacity,
  Text,
} from 'react-native';
import { Audio } from 'expo-av';

export default class SoundButton extends Component {
  state = {
    playingStatus: "reproducir",
  };

  _playAndPause = () => {
    switch (this.state.playingStatus) {
      case 'reproducir':
        this._playRecording();
        break;
      case 'pausado':
      case 'reproduciendo':
        this._pauseAndPlayRecording();
        break;
    }
  }
  
  async _playRecording() {
    const { sound } = await Audio.Sound.createAsync(
      this.props.source,
      {
        shouldPlay: true,
        isLooping: true,
      },
      this._updateScreenForSoundStatus,
    );
    this.sound = sound;
    this.setState({
      playingStatus: 'reproduciendo'
    });
  }

  async _pauseAndPlayRecording() {
    if (this.sound != null) {
      if (this.state.playingStatus == 'reproduciendo') {
        console.log('pausing...');
        await this.sound.pauseAsync();
        console.log('paused!');
        this.setState({
          playingStatus: 'pausado',
        });
      } else {
        console.log('reproduciendo...');
        await this.sound.playAsync();
        console.log('reproduciendo!');
        this.setState({
          playingStatus: 'reproduciendo',
        });
      }
    }
  }

  _updateScreenForSoundStatus = (status) => {
    if (status.isPlaying && this.state.playingStatus !== "reproduciendo") {
      this.setState({ playingStatus: "reproduciendo" });
    } else if (!status.isPlaying && this.state.playingStatus === "reproduciendo") {
      this.setState({ playingStatus: "pausado" });
    }
  };

  _syncPauseAndPlayRecording() {
    if (this.sound != null) {
      if (this.state.playingStatus == 'reproduciendo') {
        this.sound.pauseAsync();
      } else {
        this.sound.playAsync();
      }
    }
  }

  render() {
    return(
      <TouchableOpacity onPress={this._playAndPause}>
        <Text>
          {this.state.playingStatus}
        </Text>
      </TouchableOpacity>
    )
  }
}