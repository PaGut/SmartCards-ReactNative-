import React, { Component } from 'react';
import { TouchableOpacity, Button, View, StyleSheet, Text } from 'react-native';
import CardFlip from 'react-native-card-flip';

// Navigation-Buttons for Edit/View Mode
import CardButtons from '../components/CardButtons';

// Rating-Bar for Learn Mode
import Rating from '../components/Rating';

// import database
import Firebase from '../Firebase';

export default class CardDetailScreen extends Component {

    state = { cards: [], activeCard: null, question: null, answer: null, currentCount: null, maxCount: null, editMode: false, learnActive: false };

    // define card header at runtime
    static navigationOptions = ({ navigation }) => {

        var title = navigation.getParam('title');
        if (title === undefined) {
            title = "";
        }

        var buttonTitle = navigation.getParam('modeButtonTitle');
        if (buttonTitle === undefined) {
            buttonTitle = "View";
        }


        if (navigation.getParam('learnActive') !== true) {

            return {

                title: title,
                headerRight: (
                    <Button
                        onPress={navigation.getParam('setEditMode')}
                        title={buttonTitle}
                        color="lightsalmon"
                    />
                )
            };
        }
    };

    // set view mode edit/display
    _setEditMode = () => {
        debugger;
        let mode;
        if (this.state.editMode === true) {
            mode = false;
        } else {
            mode = true;
        }
        this.setState({ editMode: mode });
    }

    // set next card
    _nextCard = () => {

        var { cards, currentCount, maxCount } = this.state;
        debugger;
        // check if last entry is reached
        if (currentCount === cards.length) {
            currentCount = 0;
        }
        // get data for next card
        let activeCard = cards[currentCount];
        currentCount = currentCount + 1;
        // set new state
        this.setState({ activeCard: activeCard, currentCount: currentCount, question: activeCard.question, answer: activeCard.answer });
        // set toolbar title counter
        let sTitle = `${currentCount}/${maxCount}`;
        this.props.navigation.setParams({ title: sTitle });
    }

    // set previous card
    _previousCard = () => {

        let { cards, currentCount, maxCount } = this.state;
        // check if first card is reached
        if (currentCount === 1) {
            currentCount = cards.length + 1;
        }
        // get data for previous card
        let activeCard = cards[currentCount - 2];
        currentCount = currentCount - 1;
        this.setState({ activeCard: activeCard, currentCount: currentCount, question: activeCard.question, answer: activeCard.answer });
        // set toolbar title counter
        let sTitle = `${currentCount}/${maxCount}`;
        this.props.navigation.setParams({ title: sTitle });
    }

    _getIndexOfCurrentCard = (cards, activeCard) => {
        for (var i = 0; i <= cards.length; i++) {
            if (cards[i].id === activeCard.id) {
                // set new count                
                return i + 1;
            }
        }
    }

    // Get all cards from database
    _retrieveCards = async () => {

        let { editMode } = this.state;
        // get active selected card
        let activeCard = this.props.navigation.getParam('card');
        let email = activeCard.cardData.subjectData.userData.email;
        let subjectName = activeCard.cardData.subjectData.name;

        // read data asynchron from firebase db for specific cardList   
        let query = await Firebase.db.collection('user').doc(email).collection('subjects').doc(subjectName).collection('cardLists').doc(activeCard.cardData.id).collection('cards').get();

        let cards = [];
        // add every read entry to array of cards
        query.forEach(card => {
            cards.push({
                id: card.id,
                question: card.data().question,
                answer: card.data().answer,
            });
        });

        // set count for current card
        let currentCount = this._getIndexOfCurrentCard(cards, activeCard);
        let maxCount = cards.length;
        // set cards array to state and active card
        this.setState({ cards: cards, activeCard: activeCard, question: activeCard.question, answer: activeCard.answer, currentCount: currentCount, maxCount: maxCount });

        // set toolbar header title and button title       
        let sModeButtonTitle;
        if (editMode === false) {
            sModeButtonTitle = "Edit";
        } else {
            sModeButtonTitle = "View";
        }
        let sTitle = `${currentCount}/${maxCount}`;
        // set title of mode button
        this.props.navigation.setParams({ modeButtonTitle: sModeButtonTitle, title: sTitle });
    }

    /* called after view is called */
    componentDidMount() {
        // init firebase object        
        Firebase.init();
        debugger;
        // set function to static navigation option parameter
        this.props.navigation.setParams({ setViewMode: this._setEditMode });

        // set learn mode
        this.setState({ learnActive: this.props.navigation.getParam('learnActive') });

        // get the cards of the current deck
        this._retrieveCards();

    };

    render() {

        let { question, answer, currentCount, maxCount } = this.state;

        return (
            <View style={styles.container}>
                <Text style={styles.counter}>{currentCount}/{maxCount}</Text>
                <CardFlip style={styles.cardContainer} ref={(card) => this.card = card} >
                    <TouchableOpacity activeOpacity={1} style={[styles.card, styles.card1]} onPress={() => this.card.flip()} ><Text style={styles.label}>{question}</Text></TouchableOpacity>
                    <TouchableOpacity activeOpacity={1} style={[styles.card, styles.card2]} onPress={() => this.card.flip()} ><Text style={styles.label}>{answer}</Text></TouchableOpacity>
                </CardFlip>
                {/* Do not show CardButtons if Learning is active */}
                <CardButtons hide={this.state.learnActive} />

                {/* Show Rating bar with active learning */}
                <Rating visible={this.state.learnActive} />

            </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    counter: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
        marginBottom: 10,
    },
    cardContainer: {
        width: 320,
        height: 400,
    },
    card: {
        width: 320,
        height: 400,
        backgroundColor: '#FE474C',
        borderRadius: 5,
        shadowColor: 'rgba(0,0,0,0.5)',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.5,
    },
    card1: {
        backgroundColor: 'lightsalmon',
    },
    card2: {
        backgroundColor: 'lightgrey',
    },
    label: {
        lineHeight: 470,
        textAlign: 'center',
        fontSize: 35,
        fontFamily: 'System',
        color: 'white',
        backgroundColor: 'transparent',
    },
    buttonContainer: {
        flexDirection: 'row'
    },
    button: {
        width: 150,
        marginTop: 30,
        marginHorizontal: 20,
        backgroundColor: "lightsalmon",
        alignItems: 'center',
        paddingVertical: 20,
        borderRadius: 40,
    },
    buttonText: {
        textAlign: 'center',
        color: 'white',
        fontWeight: 'bold'
    },
});

