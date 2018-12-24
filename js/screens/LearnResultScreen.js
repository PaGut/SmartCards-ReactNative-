import React, { Component } from 'react';
import { TouchableOpacity, Button, View, StyleSheet, Text } from 'react-native';


export default class LearnResultScreen extends Component {

    // define card header at runtime
    static navigationOptions = ({ navigation }) => {
    }

    render() {
        return (
            <View>
                <Text>{this.props.navigation.getParam('score')}</Text>
            </View>

        )
    }

}