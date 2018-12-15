import React, { Component } from 'react';
import { TouchableOpacity, View, StyleSheet, Text } from 'react-native';
import CardFlip from 'react-native-card-flip';
// import database
import Firebase from '../Firebase';

export default class CardScreen extends Component {

    state = { cards: {}, activeCard: null };

    // define card header at runtime
    static navigationOptions = ({ navigation }) => {
        const card = navigation.getParam('card');
        return {
            title: "TestName"
        };
    };

    // Get all cards from database
    _retrieveCards = async () => {
        let card = this.props.navigation.getParam('card');

        let email = cardList.subjectData.userData.email;
        let subjectName = cardList.subjectData.name;

        // read data asynchron from firebase db for specific cardList   
        let query = await Firebase.db.collection('user').doc(email).collection('subjects').doc(subjectName).collection('cardLists').doc(card.id).collection('cards').get();

        // add every read entry to array of cards
        query.forEach(card => {
            cards.push({
                id: card.id,
                question: card.data().question,
                answer: card.data().answer,
            });
        });
        // set cards array to state
        this.setState({ cards });
    }

    /* called after view is called */
    componentDidMount() {
        // set function to static navigation option parameter
        //this.props.navigation.setParams({ setCreateCardListScreen: this._setCreateCardListScreen });
        // init firebase object        
        Firebase.init();
        // get the cards of the current deck
        this._retrieveCards();
    }

    render() {

        let cardList = this.props.navigation.getParam('card');

        return (
            <View style={styles.container}>
                <Text style={styles.counter}>1/15</Text>
                <CardFlip style={styles.cardContainer} ref={(card) => this.card = card} >
                    <TouchableOpacity activeOpacity={1} style={[styles.card, styles.card1]} onPress={() => this.card.flip()} ><Text style={styles.label}>Question</Text></TouchableOpacity>
                    <TouchableOpacity activeOpacity={1} style={[styles.card, styles.card2]} onPress={() => this.card.flip()} ><Text style={styles.label}>Answer</Text></TouchableOpacity>
                </CardFlip>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={() => console.log("Previous")}>
                        <Text style={styles.buttonText}>Previous</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => console.log("Next")}>
                        <Text style={styles.buttonText}>Next</Text>
                    </TouchableOpacity>
                </View>
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
        fontSize: 55,
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

