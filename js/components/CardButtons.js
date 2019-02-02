import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
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
                    <Icon.Button name="navigate-before" color="lightsalmon" size="50" iconStyle={{ marginRight: 0 }} backgroundColor="transparent" onPress={() => this.props.previous()}>
                    </Icon.Button>
                    <Icon.Button iconStyle={{ marginRight: 10, marginLeft: 10 }} name="photo" color="lightsalmon" size="50" backgroundColor="transparent" onPress={() => this.props.openImage()}>
                    </Icon.Button>
                    <Icon.Button name="navigate-next" color="lightsalmon" size="50" iconStyle={{ marginRight: 0 }} backgroundColor="transparent" onPress={() => this.props.next()}>
                    </Icon.Button>
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