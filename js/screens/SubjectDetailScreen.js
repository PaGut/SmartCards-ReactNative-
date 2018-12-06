import React, { Component } from 'react';
import { Dimensions, Button, Image, ScrollView, StyleSheet, Text } from 'react-native';

export default class SubjectListItem extends Component {

    // set subject title at runtime// titel zur Laufzeit setzen
    static navigationOptions = ({ navigation }) => {
        const subject = navigation.getParam('subject');
        return {
            title: subject.name
        };
    };

    render() {
        const subject = this.props.navigation.getParam('subject');

        return (
            <ScrollView contentContainerStyle={styles.container} style={styles.scrollView}>
                <Text>{subject.name}</Text>
            </ScrollView>
        );
    }
}

//Dynamische Breite anhand des Windows berechnen
const width = Dimensions.get('window').width * 0.75;

const styles = StyleSheet.create({
    container: {
        //flex: 1, wenn Scrollen an ist kein flex nutzen, funktioniert dann nicht
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20
    },
    scrollView: {
        backgroundColor: '#fff'
    },
    image: {
        width: width,
        height: width,
        marginBottom: 20
    }
});

