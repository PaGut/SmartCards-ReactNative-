import React, { Component } from 'react';
import { Alert, ActivityIndicator, Button, View, FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';
// import database
import Firebase from '../Firebase';
// import Card
import Card from '../components/Card';
// import NewCard
import NewCard from '../components/NewCard';
// import icons
import Icon from 'react-native-vector-icons/MaterialIcons';

export default class CardScreen extends Component {

    state = { cardList: {}, cards: [], isLoading: true, showCreateCardScreen: false };

    // set cardList title at runtime
    static navigationOptions = ({ navigation }) => {
        const cardList = navigation.getParam('cardList');

        return {
            title: cardList.name,
            headerRight: (
                <Icon.Button name="add" color="lightsalmon" size="30" iconStyle={{ marginRight: 0 }} backgroundColor="transparent" onPress={navigation.getParam('setCreateCard')}>
                </Icon.Button>
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
        // add focus event, called every time the site is focused for navigation
        this.props.navigation.addListener('willFocus', () => {
            debugger;
            this._refresh();
        });
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
            // save card to database
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
            // refresh list
            this._refresh();
        } catch (error) {
            alert('No internet connection');
        }
        this.setState({ cards });
    }

    /* delete selected subject from firebase DB */
    _deleteCard = async (deleteRow) => {

        let { cardList, userData } = this.state;
        let email = cardList.subjectData.userData.email;
        let subjectName = cardList.subjectData.name;

        try {
            // add subject to specific user collection
            docRef = await Firebase.db.collection('user').doc(email).collection('subjects').doc(subjectName).collection('cardLists').doc(cardList.id).collection('cards').doc(deleteRow).delete();
            // set new generated id to array entry
            this.setState({ isLoading: true });
            this._retrieveCards();

            //subjects[subjects.length - 1].id = docRef.id;
        } catch (error) {
            alert('Card does not exist');
        }
    }

    _refresh = () => {
        this.setState({ isLoading: true });
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
            <View style={styles.container} >
                <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate('CardDetailScreen', {
                    card: this.state.cards[0], learnActive: true
                }
                )}>
                    <Text style={styles.buttonText}>Start learning</Text>
                </TouchableOpacity>
                <FlatList
                    data={this.state.cards}
                    keyExtractor={item => item.id}
                    ItemSeparatorComponent={() => <View style={styles.listSeparator} />}
                    ListEmptyComponent={() => (<Text style={styles.listEmpty}>No cards exist</Text>)}
                    refreshing={this.state.isLoading}
                    onRefresh={this._refresh}
                    renderItem={({ item, index }) => (
                        // render CardListItems
                        <Card card={item} index={index} onDelete={this._deleteCard} onPress={() => this.props.navigation.navigate('CardDetailScreen', {
                            card: item, learnActive: false
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
    },
    button: {
        marginTop: 10,
        justifyContent: 'flex-start',
        backgroundColor: "lightsalmon",
        alignItems: 'center',
        paddingVertical: 15,
        borderRadius: 40,
        marginBottom: 10
    },
    buttonText: {
        textAlign: 'center',
        color: 'white',
        fontWeight: 'bold'
    },
});

