import React, { Component } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View, Modal, TextInput, KeyboardAvoidingView } from 'react-native';

export default class NewCard extends Component {

    state = { question: null, answer: null, saveDisabled: true };

    onSavePressed = (question, answer) => {
        //call save property
        this.props.onSave(question, answer);
        //reset values for Card
        this.setState({ question: null, answer: null });
    }

    onCancelPressed = () => {
        this.props.onCancel();
        this.setState({ question: null, answer: null, saveDisabled: true });
    }


    render() {
        const { visible, onSave } = this.props;
        const { question, answer, saveDisabled } = this.state;

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
                    <TextInput style={[styles.input, { height: 80 }]} placeholder="Enter question" multiline={false}
                        underlineColorAndroid="transparent" onChangeText={(value) => this._inputChanged(value)}>
                    </TextInput>
                    <TextInput style={[styles.input, { height: 80 }]} placeholder="Enter answer" multiline={false}
                        underlineColorAndroid="transparent" onChangeText={(value) => this.setState({ answer: value })}>
                    </TextInput>

                    <View>
                        <TouchableOpacity disabled={saveDisabled} style={[styles.button, saveBtnStyle.color]} onPress={() => this.onSavePressed(question, answer)}>
                            <Text style={styles.buttonText}>Save</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button]} onPress={() => console.log("Photo")}>
                            <Text style={styles.buttonText}>photo icon</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={() => this.onCancelPressed()}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </Modal>

        );


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
        marginBottom: 20
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
