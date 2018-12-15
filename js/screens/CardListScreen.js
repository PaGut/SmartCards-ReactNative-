import React, { Component } from 'react';
import { Alert, Text, ActivityIndicator, Dimensions, View, FlatList, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
// import database
import Firebase from '../Firebase';
// import Card
import Card from '../components/Card';

export default class CardListScreen extends Component {

    state = { cardList: {}, cards: [], isLoading: true };

    // set cardList title at runtime
    static navigationOptions = ({ navigation }) => {
        const cardList = navigation.getParam('cardList');

        return {
            title: cardList.name
        };
    };

    // Get cards from database
    _retrieveCards = async () => {
        let cardList = this.props.navigation.getParam('cardList');

        let cards = [];
        let email = cardList.subjectData.userData.email;
        let subjectName = cardList.subjectData.name;
        console.log(email);
        // read data asynchron from firebase db for specific cardList   
        let query = await Firebase.db.collection('user').doc(email).collection('subjects').doc(subjectName).collection('cardLists').doc(cardList.id).collection('cards').get();

        // add every read entry to array of cards
        query.forEach(card => {
            cards.push({
                id: card.id,
                question: card.data().question,
                answer: card.data().answer,
                cardData: cardList
            });
        });
        // neuen state setzen und loading indicator false setzen
        this.setState({ cardList, cards, isLoading: false });
    }

    // Called after the view is loaded
    componentDidMount() {
        // init firebase
        Firebase.init();
        debugger;
        // get the cards of the current deck
        this._retrieveCards();
    }

    render() {

        if (this.state.isLoading) {
            return (
                <View style={styles.container}>
                    <ActivityIndicator />
                </View>);
        }

        let cardList = this.props.navigation.getParam('cardList');

        return (
            <ScrollView contentContainerStyle={styles.container} style={styles.scrollView}>
                <View>
                    <FlatList
                        data={this.state.cards}
                        keyExtractor={item => item.id}
                        ItemSeparatorComponent={() => <View style={styles.listSeparator} />}
                        ListEmptyComponent={() => (<Text style={styles.listEmpty}>No CardList exists</Text>)}
                        refreshing={this.state.isLoading}
                        onRefresh={this._refresh}
                        renderItem={({ item, index }) => (
                            // render Card
                            <Card card={item} index={index} onPress={() => this.props.navigation.navigate('CardScreen', {
                                card: item
                            })}></Card>
                        )}
                    />
                </View>
            </ScrollView>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'white',
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

