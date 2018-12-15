import React, { Component } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Swipeout from 'react-native-swipeout';

export default class Card extends Component {

    render() {
        return (
            
            <Text>{this.props.card.question}</Text>
        )
    }

}
