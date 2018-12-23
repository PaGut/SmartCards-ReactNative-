
import React, { Component } from 'react';
import { TouchableOpacity, View, StyleSheet, Text } from 'react-native';


export default class CardButtons extends Component {

    render() {
        if (this.props.hide) {
            //Learn mode is active, hide the buttons->return empty View
            return (<View />)
        }
        else {
            //Learn mode is not active, show the buttons ->return buttons
            return (
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={() => this._previousCard()}>
                        <Text style={styles.buttonText}>Previous</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => this._nextCard()}>
                        <Text style={styles.buttonText}>Next</Text>
                    </TouchableOpacity>
                </View>
            )
        }

    }
}

const styles = StyleSheet.create({
    buttonContainer: {
        flexDirection: 'row'
    },
    button: {
        width: 150,
        marginTop: 30,
        marginHorizontal: 20,
        backgroundColor: "lightsalmon",
        alignItems: 'center',
        paddingVertical: 20,
        borderRadius: 40,
    },
    buttonText: {
        textAlign: 'center',
        color: 'white',
        fontWeight: 'bold'
    },
});