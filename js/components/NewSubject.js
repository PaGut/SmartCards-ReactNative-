import React, { Component } from 'react';
import { StyleSheet, Text, Button, Modal, TextInput, KeyboardAvoidingView } from 'react-native';

export default class NewSubject extends Component {

    state = { name: null };

    render() {

        const { visible, onSave } = this.props;
        const { name } = this.state;

        return (
            <Modal visible={visible} onRequestClose={() => {
                this.setState({ name: null });
                onSave(null)
            }} animationType="slide">
                <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
                    <Text style={styles.text}>Create New Subject</Text>
                    <TextInput style={[styles.input, { height: 150 }]} placeholder="Subject Name" multiline={false}
                        underlineColorAndroid="transparent" onChangeText={(value) => this.setState({ name: value })}>
                    </TextInput>
                    <Button title="Save"
                        onPress={() => {
                            // reset value for subject name
                            this.setState({ name: null });
                            // call save property
                            onSave(name);
                        }} />
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
    }
});