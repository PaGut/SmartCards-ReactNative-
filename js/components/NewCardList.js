import React, { Component } from 'react';
import { StyleSheet, Text, Button, Modal, TextInput, KeyboardAvoidingView } from 'react-native';

export default class NewCardList extends Component {

    state = { name: null, desc: null, examDate: null };

    render() {

        const { visible, onSave } = this.props;
        const { name, desc, examDate } = this.state;

        return (
            <Modal visible={visible} onRequestClose={() => {
                this.setState({ name: null, desc: null, examDate: null });
                onSave(null, null, null)
            }} animationType="slide">
                <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
                    <Text style={styles.text}>Create New CardList</Text>
                    <TextInput style={[styles.input, { height: 80 }]} placeholder="Enter name" multiline={false}
                        underlineColorAndroid="transparent" onChangeText={(value) => this.setState({ name: value })}>
                    </TextInput>
                    <TextInput style={[styles.input, { height: 80 }]} placeholder="Enter description" multiline={false}
                        underlineColorAndroid="transparent" onChangeText={(value) => this.setState({ desc: value })}>
                    </TextInput>
                    <TextInput style={[styles.input, { height: 80 }]} placeholder="Enter exam date" multiline={false}
                        underlineColorAndroid="transparent" onChangeText={(value) => this.setState({ examDate: value })}>
                    </TextInput>
                    <Button title="Save"
                        onPress={() => {
                            // reset value for subject name
                            this.setState({ name: null, desc: null, examDate: null });
                            // call save property
                            onSave(name, desc, examDate);
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
        height: 50,
        marginBottom: 20,
    }
});