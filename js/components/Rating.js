import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default class Rating extends Component {

    render() {
        if (this.props.visible) {
            return (
                <TouchableOpacity style={styles.container}></TouchableOpacity>
                // <TouchableOpacity></TouchableOpacity>
                // <TouchableOpacity></TouchableOpacity>
                // <TouchableOpacity></TouchableOpacity>
                // <TouchableOpacity></TouchableOpacity>
            );
        }
        else {
            return (<View />);
        }
    }


}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: 'red'
    },
})