import React, { Component } from 'react';
import { Modal, Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Camera, Permissions } from 'expo';

export default class CameraView extends Component {

    state = { type: Camera.Constants.Type.back };

    _takeSnap = async () => {
        debugger;
        if (this.camera) {
            let photo = await this.camera.takePictureAsync();

        }
        debugger;
    }

    render() {

        const { visible } = this.props;

        return (
            <Modal style={styles.container} visible={visible}>
                <Camera style={{ flex: 1 }} type={this.state.type} ref={ref => { this.camera = ref; }}>
                    <View
                        style={{
                            flex: 1,
                            backgroundColor: 'transparent',
                            flexDirection: 'row',
                        }}>
                        <TouchableOpacity
                            style={{
                                flex: 0.1,
                                alignSelf: 'flex-end',
                                alignItems: 'center',
                            }}
                            onPress={() => {
                                this.setState({
                                    type: this.state.type === Camera.Constants.Type.back
                                        ? Camera.Constants.Type.front
                                        : Camera.Constants.Type.back,
                                });
                            }}>
                            <Text
                                style={{ fontSize: 18, marginBottom: 10, color: 'white' }}>
                                {' '}Flip{' '}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                flex: 0.1,
                                alignSelf: 'flex-end',
                                alignItems: 'center',
                            }}
                            onPress={() => {
                                this._takeSnap();
                            }}>
                            <Text
                                style={{ fontSize: 18, marginBottom: 10, color: 'white' }}>
                                {' '}Take Photo{' '}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </Camera>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    }
});
