import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, TextInput, KeyboardAvoidingView } from 'react-native';
import DatePicker from 'react-native-datepicker';


export default class NewCardDeck extends Component {

    state = { name: null, desc: null, examDate: new Date(), saveDisabled: true };

    _setDate = (newDate) => {
        this.setState({ examDate: newDate })
    }

    onSavePressed = (name, desc, examDate) => {
        // call save property
        this.props.onSave(name, desc, examDate);
        // reset value for CardDeck name
        this.setState({ name: null, desc: null, examDate: null });
    }

    onCancelPressed = () => {
        this.props.onCancel();
        this.setState({ name: null, desc: null, examDate: null, saveDisabled: true });
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

    render() {

        const { visible, onSave } = this.props;
        const { name, desc, examDate, saveDisabled } = this.state;

        // set dynamic color of save button for disabled
        var saveBtnStyle = StyleSheet.create({
            color: {
                backgroundColor: saveDisabled ? 'transparent' : 'lightsalmon'
            }
        });

        return (
            <Modal visible={visible} onRequestClose={() => {
                this.setState({ name: null, desc: null, examDate: null });
                onSave(null, null, null)
            }} animationType="slide">
                <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
                    <Text style={styles.text}>Create New CardDeck</Text>
                    <TextInput style={[styles.input, { height: 80 }]} placeholder="Name eingeben" multiline={false}
                        underlineColorAndroid="transparent" onChangeText={(value) => this._inputChanged(value)}>
                    </TextInput>
                    <TextInput style={[styles.input, { height: 80 }]} placeholder="Beschreibung eingeben" multiline={false}
                        underlineColorAndroid="transparent" onChangeText={(value) => this.setState({ desc: value })}>
                    </TextInput>
                    <DatePicker
                        style={styles.datePicker}
                        date={this.state.examDate}
                        mode="date"
                        placeholder="Datum wählen"
                        format="YYYY-MM-DD"
                        minDate="2018-01-01"
                        maxDate="2020-12-31"
                        confirmBtnText="Bestätigen"
                        cancelBtnText="Abbrechen"
                        customStyles={{
                            dateIcon: {
                                position: 'absolute',
                                left: 0,
                                top: 4,
                                marginLeft: 0
                            },
                            dateInput: {
                                marginLeft: 36
                            }
                        }}
                        onDateChange={(newDate) => { this.setState({ examDate: newDate }) }}
                    />
                    <View>
                        <TouchableOpacity disabled={saveDisabled} style={[styles.button, saveBtnStyle.color]} onPress={() => this.onSavePressed(name, desc, examDate)}>
                            <Text style={styles.buttonText}>Save</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={() => this.onCancelPressed()}>
                            <Text style={styles.buttonText}>Cancel</Text>
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
        height: 50,
        marginBottom: 20
    },
    datePicker: {
        borderWidth: 1,
        borderColor: 'lightsalmon',
        borderRadius: 4,
        marginBottom: 20,
        width: 300
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