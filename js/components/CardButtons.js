
import React, { Component } from 'react';
import { TouchableOpacity, View, StyleSheet, Text } from 'react-native';
// import icons
import Icon from 'react-native-vector-icons/MaterialIcons';

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
                    <TouchableOpacity style={styles.button} onPress={() => this.props.previous()}>
                        <Icon name="arrow-back" color="white" size={50} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => this.props.next()}>
                        <Icon name="arrow-forward" color="white" size={50} />
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
});