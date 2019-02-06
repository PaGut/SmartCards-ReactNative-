import React, { Component } from 'react';
import { Alert, ActivityIndicator, View, FlatList, StyleSheet, Text } from 'react-native';
// import database
import Firebase from '../Firebase';
// import Card
import Card from '../components/Card';
// import NewCard
import NewCard from '../components/NewCard';
// import icons
import Icon from 'react-native-vector-icons/MaterialIcons';

export default class CardScreen extends Component {

    state = { CardDeck: {}, cards: [], isLoading: true, showCreateCardScreen: false };

    // set CardDeck title at runtime
    static navigationOptions = ({ navigation }) => {
        const CardDeck = navigation.getParam('CardDeck');

        return {
            title: CardDeck.name,
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
            this._refresh();
        });
    }

    // Get cards from database
    _retrieveCards = async () => {
        let CardDeck = this.props.navigation.getParam('CardDeck');

        let cards = [];
        let email = CardDeck.subjectData.userData.email;
        let subjectName = CardDeck.subjectData.name;

        // read data asynchron from firebase db for specific CardDeck
        let query = await Firebase.db.collection('user').doc(email).collection('subjects').doc(subjectName).collection('CardDecks').doc(CardDeck.id).collection('cards').get();

        // add every read entry to array of cards
        query.forEach(card => {
            cards.push({
                id: card.id,
                question: card.data().question,
                answer: card.data().answer,
                fileDownloadUrl: card.data().fileDownloadUrl,
                cardData: CardDeck,
            });
        });
        // neuen state setzen und loading indicator false setzen
        this.setState({ CardDeck, cards, isLoading: false });
    }

    _setCreateCard = () => {
        this.setState({ showCreateCardScreen: true });
    }

    _addCard = (question, answer, fileDownloadUrl) => {
        let { cards } = this.state;

        // check if card question is empty
        if (question) {
            // set card list data
            cards.push({ question: question, answer: answer, fileDownloadUrl: fileDownloadUrl });
            // save card to database
            this._saveCardToDB(question, answer, fileDownloadUrl, cards);
        } else {
            Alert.alert('Frage ist nicht befüllt',
                'Bitte tragen Sie eine Frage ein',
                [{ text: 'OK', style: 'cancel' }]);
        }
        this.setState({ cards, showCreateCardScreen: false });
    }
    _closeCreateCardScreen = () => {
        this.setState({ showCreateCardScreen: false });
    }

    _saveCardToDB = async (question, answer, fileDownloadUrl, cards) => {
        let { CardDeck } = this.state;
        let email = CardDeck.subjectData.userData.email;
        let subjectName = CardDeck.subjectData.name;

        try {
            //save data to database collection card
            docRef = await Firebase.db.collection('user').doc(email).collection('subjects').doc(subjectName).collection('CardDecks').doc(CardDeck.id).collection('cards').add({ question, answer, fileDownloadUrl });
            // set new generated id to array entry
            cards[cards.length - 1].id = docRef.id;
            // refresh list
            this._refresh();
        } catch (error) {
            alert('Keine Internetverbindung, Service-Aufruf fehlgeschlagen.');
        }
        this.setState({ cards });
    }

    /* delete selected subject from firebase DB */
    _deleteCard = async (deleteRow) => {

        let { CardDeck, userData } = this.state;
        let email = CardDeck.subjectData.userData.email;
        let subjectName = CardDeck.subjectData.name;

        try {
            // add subject to specific user collection
            docRef = await Firebase.db.collection('user').doc(email).collection('subjects').doc(subjectName).collection('CardDecks').doc(CardDeck.id).collection('cards').doc(deleteRow).delete();
            // set new generated id to array entry
            this.setState({ isLoading: true });
            this._retrieveCards();

            //subjects[subjects.length - 1].id = docRef.id;
        } catch (error) {
            alert('Karte existiert nicht.');
        }
    }

    _refresh = () => {
        this.setState({ isLoading: true });
        this._retrieveCards();
    }

    _startLearning = () => {
        this.props.navigation.navigate('CardDetailScreen', {
            card: this.state.cards[0], learnActive: true, CardDeck: this.props.navigation.getParam('CardDeck')
        });
    }

    render() {

        if (this.state.isLoading) {
            return (
                <View style={styles.container}>
                    <ActivityIndicator />
                </View>);
        }

        let CardDeck = this.props.navigation.getParam('CardDeck');

        return (
            <View style={styles.container} >
                <FlatList
                    data={this.state.cards}
                    keyExtractor={item => item.id}
                    ItemSeparatorComponent={() => <View style={styles.listSeparator} />}
                    ListEmptyComponent={() => (<Text style={styles.listEmpty}>Bitte erstellen Sie Ihre erste Karte</Text>)}
                    refreshing={this.state.isLoading}
                    onRefresh={this._refresh}
                    renderItem={({ item, index }) => (
                        // render CardDeckItems
                        <Card card={item} index={index} onDelete={this._deleteCard} onStartLearning={this._startLearning} onPress={() => this.props.navigation.navigate('CardDetailScreen', {
                            card: item, learnActive: false, CardDeck: this.props.navigation.getParam('CardDeck')
                        })} />
                    )}
                >
                </FlatList>
                <NewCard visible={this.state.showCreateCardScreen} cardDeck={CardDeck} onSave={this._addCard} onCancel={this._closeCreateCardScreen} />
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

