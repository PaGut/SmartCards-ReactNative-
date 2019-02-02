import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet, Text, View, Modal, TextInput, KeyboardAvoidingView } from 'react-native';

export default class NewSubject extends Component {

    state = { name: null, saveDisabled: true };

    _savePressed = (name) => {
        // call save property
        this.props.onSave(name);
        // reset value for subject name
        this.setState({ name: null, saveDisabled: false });
    }

    _inputChanged = (value) => {
        debugger;
        // set new value
        this.setState({ name: value });
        // check if value is not initial
        debugger;
        if (value === "") {
            this.setState({ saveDisabled: true });
        } else {
            this.setState({ saveDisabled: false });
        }
    }

    onCancelPressed = () => {
        this.props.onCancel();
        this.setState({ name: null, saveDisabled: true });
    }

    render() {

        const { visible, onSave, onCancel } = this.props;
        const { name, saveDisabled } = this.state;

        // set dynamic color of save button for disabled
        var saveBtnStyle = StyleSheet.create({
            color: {
                backgroundColor: saveDisabled ? 'transparent' : 'lightsalmon'
            }
        });

        return (
            <Modal visible={visible} onRequestClose={() => {
                this.setState({ name: null });
                onSave(null)
            }} animationType="slide">
                <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
                    <Text style={styles.text}>Lernfach anlegen</Text>
                    <TextInput style={[styles.input, { height: 150 }]} placeholder="Fach Name" multiline={false}
                        underlineColorAndroid="transparent" onChangeText={(value) => this._inputChanged(value)}>
                    </TextInput>
                    <View>
                        <TouchableOpacity disabled={saveDisabled} style={[styles.button, saveBtnStyle.color]} onPress={() => this._savePressed(name)}>
                            <Text style={styles.buttonText}>Speichern</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={() => this.onCancelPressed()}>
                            <Text style={styles.buttonText}>Abbrechen</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </Modal >
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
        height: 50
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