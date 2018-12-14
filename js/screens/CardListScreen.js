import React, { Component } from 'react';
import { Alert, ActivityIndicator, Dimensions, View, FlatList, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
// import database
import Firebase from '../Firebase';

export default class CardListScreen extends Component {

    state = { cards: [], isLoading: true };

    // set cardList title at runtime
    static navigationOptions = ({ navigation }) => {
        const cardList = navigation.getParam('cardList');

        return {
            title: cardList.name
        };
    };

    _retrieveCardList = async () => {
        //Liste der Karteikarten aus der Firebase laden
    }

    render() {
        if (this.state.isLoading) {
            return (
                <View style={styles.container}>
                    <ActivityIndicator />
                </View>);
        }

        return (
            <ScrollView style={styles.container} >


                <FlatList>

                </FlatList>

                {/* <FlatList
                    data={this.state.cards}
                    keyExtractor={item => item.name}
                    ItemSeparatorComponent={() => <View style={styles.listSeparator} />}
                    ListEmptyComponent={() => (<Text style={styles.listEmpty}>No Data</Text>)}
                    refreshing={this.state.isLoading}
                    onRefresh={this._refresh}
                    renderItem={({ item }) => (
                        // render SubjectListItems
                        <CardListItem subject={item} onPress={() => this.props.navigation.navigate('CardDetailScreen', {
                            cards: item
                        })}></CardListItem>
                    )}
                /> */}

            </ScrollView>
        );
    }


    // Called after the view is loaded
    componentDidMount() {
        // init firebase
        Firebase.init();
        // get the cards of the current deck
        this._retrieveCards();
    }
    // Get cards from database
    _retrieveCards = async () => {
        let cards = this.props.navigation.getParam('cards');
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'red',
    },
    listSeparator: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: 'lightsalmon',
        marginVertical: 5
    },
    listEmpty: {
        paddingTop: 100,
        fontSize: 30,
        textAlign: 'center'
    }
});

