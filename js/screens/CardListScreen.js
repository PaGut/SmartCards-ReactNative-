import React, { Component } from 'react';
import { Alert, ActivityIndicator, Dimensions, View, FlatList, TouchableOpacity, ScrollView, StyleSheet, Text } from 'react-native';
// import database
import Firebase from '../Firebase';

export default class CardListScreen extends Component {

    // set cardList title at runtime
    static navigationOptions = ({ navigation }) => {
        const cardList = navigation.getParam('cardList');
        return {
            title: cardList.name
        };
    };

    /* called after view is called */
    componentDidMount() {
        // init firebase object        
        Firebase.init();
    }

    render() {

        let cardList = this.props.navigation.getParam('cardList');

        return (
            <View style={styles.container}>
                <Text>cardList.name</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'red',
    }
});

