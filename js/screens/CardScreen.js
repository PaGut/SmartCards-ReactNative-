import React, { Component } from 'react';
import { Alert, ActivityIndicator, Button, View, FlatList, StyleSheet, Text } from 'react-native';
// import database
import Firebase from '../Firebase';
// import Card
import Card from '../components/Card';
// import NewCard
import NewCard from '../components/NewCard';


export default class CardListScreen extends Component {

    state = { cardList: {}, cards: [], isLoading: true, showCreateCardScreen: false };

    // set cardList title at runtime
    static navigationOptions = ({ navigation }) => {
        const cardList = navigation.getParam('cardList');

        return {
            title: cardList.name,
            headerRight: (
                <Button
                    onPress={navigation.getParam('setCreateCard')}
                    title="Create"
                    color="lightsalmon"
                />
            )
        };
    };

    // Called after the view is loaded
    componentDidMount() {
        // init firebase
        Firebase.init();
        // set function to static navigation option parameter
        this.props.navigation.setParams({ setCreateCard: this._setCreateCard });
        // get the cards of the current deck
        this._retrieveCards();
    }

    // Get cards from database
    _retrieveCards = async () => {
        let cardList = this.props.navigation.getParam('cardList');

        let cards = [];
        let email = cardList.subjectData.userData.email;
        let subjectName = cardList.subjectData.name;

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

    _setCreateCard = () => {
        this.setState({ showCreateCardScreen: true });
    }

    _addCard = (question, answer) => {
        let { cards } = this.state;

        // check if card question is empty
        if (question) {
            // set card list data
            cards.push({ question: question, answer: answer });
            // save quote within sql lite database

            this._saveCardToDB(question, answer, cards);
        } else {
            Alert.alert('Card question is empty',
                'Please enter a Card question',
                [{ text: 'OK', style: 'cancel' }]);
        }
        this.setState({ cards, showCreateCardScreen: false });

    }
    _closeCreateCardScreen = () => {
        this.setState({ showCreateCardScreen: false });
    }

    _saveCardToDB = async (question, answer, cards) => {
        let { cardList } = this.state;
        let email = cardList.subjectData.userData.email;
        let subjectName = cardList.subjectData.name;

        try {
            //save data to database collection card
            docRef = await Firebase.db.collection('user').doc(email).collection('subjects').doc(subjectName).collection('cardLists').doc(cardList.id).collection('cards').add({ question, answer });
            // set new generated id to array entry
            cards[cards.length - 1].id = docRef.id;
        } catch (error) {
            alert('No internet connection');
        }
        this.setState({ cards });

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
            <View style={styles.container} >
                <FlatList
                    data={this.state.cards}
                    keyExtractor={item => item.id}
                    ItemSeparatorComponent={() => <View style={styles.listSeparator} />}
                    ListEmptyComponent={() => (<Text style={styles.listEmpty}>No Data</Text>)}
                    refreshing={this.state.isLoading}
                    onRefresh={this._refresh}
                    renderItem={({ item }) => (
                        // render CardListItems
                        <Card card={item} onPress={() => this.props.navigation.navigate('CardLearningScreen', {
                            card: item
                        })} />
                    )}
                >
                </FlatList>
                <NewCard visible={this.state.showCreateCardScreen} onSave={this._addCard} onCancel={this._closeCreateCardScreen} />
            </View>
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

