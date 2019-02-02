import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Modal, TextInput, KeyboardAvoidingView } from 'react-native';
import { ImagePicker } from 'expo';
// import database
import Firebase from '../Firebase';

export default class NewCard extends Component {

    state = { question: null, answer: null, fileDownloadUrl: null, saveDisabled: true };

    onSavePressed = (question, answer, fileDownloadUrl) => {
        //call save property
        this.props.onSave(question, answer, fileDownloadUrl);
        //reset values for Card
        this.setState({ question: null, answer: null, fileDownloadUrl: null });
    }

    onCancelPressed = () => {
        this.props.onCancel();
        this.setState({ question: null, answer: null, saveDisabled: true });
    }

    _inputChanged = (value) => {
        //change the state
        this.setState({ question: value });

        //disable/enable savebutton
        if (value == "") {
            this.setState({ saveDisabled: true });
        }
        else {
            this.setState({ saveDisabled: false });
        }
    }

    _takePicture = async () => {
        let result = await ImagePicker.launchCameraAsync({
            base64: true,
            quality: 1,
            allowsEditing: true,
            aspect: [4, 3],
        });
        // upload file to firebase storage as base64
        this._uploadFile(result)
    };

    _uploadFile = async (result) => {

        var ref = Firebase.storage.ref().child("images/images.jpg");
        var uploadTask = ref.putString(result.base64, "base64");
        //var uploadTask = ref.put(blob, metadata);

        uploadTask.on('state_changed', function (snapshot) {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
                case Firebase.storage.TaskState.PAUSED: // or 'paused'
                    console.log('Upload is paused');
                    break;
                case Firebase.storage.TaskState.RUNNING: // or 'running'
                    console.log('Upload is running');
                    break;
            }
        }, function (error) {
            // Handle unsuccessful uploads
        }, function () {
            // Handle successful uploads on complete            
            uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                console.log('File available at', downloadURL);
                // set download to url
                this.setState({ fileDownloadUrl: downloadURL });
            }.bind(this));
        }.bind(this));
    }

    async componentWillMount() {
        // init firebase object        
        Firebase.init();
    }

    render() {
        const { visible, onSave } = this.props;
        const { question, answer, fileDownloadUrl, saveDisabled } = this.state;

        // set dynamic color of save button for disabled
        var saveBtnStyle = StyleSheet.create({
            color: {
                backgroundColor: saveDisabled ? 'transparent' : 'lightsalmon'
            }
        });
        return (
            <Modal visible={visible} onRequestClose={() => {
                this.setState({ question: null, answer: null, saveDisabled: null });
                onSave(null, null, null)
            }
            } animationType="slide" >
                <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
                    <Text style={styles.text}>Create New Card</Text>
                    <TextInput style={styles.input} placeholder="Enter question" multiline={false}
                        underlineColorAndroid="transparent" onChangeText={(value) => this._inputChanged(value)}>
                    </TextInput>
                    <TextInput style={styles.input} placeholder="Enter answer" multiline={false}
                        underlineColorAndroid="transparent" onChangeText={(value) => this.setState({ answer: value })}>
                    </TextInput>
                    <View>
                        <TouchableOpacity disabled={saveDisabled} style={[styles.button, saveBtnStyle.color]} onPress={() => this.onSavePressed(question, answer, fileDownloadUrl)}>
                            <Text style={styles.buttonText}>Save</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button]} onPress={() => this._takePicture()}>
                            <Text style={styles.buttonText}>Take Picture</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={() => this.onCancelPressed()}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: 'lightsalmon',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20
    },
    input: {
        borderWidth: 1,
        borderColor: 'lightsalmon',
        borderRadius: 4,
        width: '80%',
        fontSize: 20,
        padding: 10,
        height: 50,
        marginBottom: 20,
        height: 80
    },
    button: {
        width: 300,
        marginTop: 10,
        marginHorizontal: 20,
        backgroundColor: "lightsalmon",
        alignItems: 'center',
        paddingVertical: 15,
        borderRadius: 40,
        marginBottom: 10
    },
    buttonText: {
        textAlign: 'center',
        color: 'white',
        fontWeight: 'bold'
    },
    cancelButton: {
        marginTop: 200
    }
});
