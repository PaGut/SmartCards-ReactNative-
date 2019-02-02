import React, { Component } from 'react';
import { Alert, KeyboardAvoidingView, TextInput, TouchableOpacity, View, StyleSheet, Text } from 'react-native';
import CardFlip from 'react-native-card-flip';
import Toast, { DURATION } from 'react-native-easy-toast';
import ImageView from 'react-native-image-view';
// Navigation-Buttons for Edit/View Mode
import CardButtons from '../components/CardButtons';
// Rating-Bar for Learn Mode
import RatingBar from '../components/RatingBar';
// import database
import Firebase from '../Firebase';
// import icons
import Icon from 'react-native-vector-icons/MaterialIcons';

export default class CardDetailScreen extends Component {

    state = {
        cards: [], cardDeck: null, activeCard: null,
        question: null, answer: null,
        currentCount: null, maxCount: null,
        editMode: false, learnActive: false,
        ratings: [],
        questionActive: true,
        fileDownloadUrl: null,
        showImage: false
    };

    // define card header at runtime
    static navigationOptions = ({ navigation }) => {

        var title = navigation.getParam('title');
        if (title === undefined) {
            title = "";
        }

        // create toolbar button
        if (navigation.getParam('learnActive') !== true) {
            return {
                title: title,
                headerRight: (
                    <Icon.Button iconStyle={{ marginRight: 0 }} name="edit" color="lightsalmon" size="30" backgroundColor="transparent" onPress={navigation.getParam('setEditMode')}>
                    </Icon.Button>
                ),

            };
        }
    };

    // open or close assigned image
    _openImage = () => {

        let { showImage, activeCard } = this.state;
        // check if image should be shown or not
        let show;
        if (activeCard.fileDownloadUrl !== undefined) {
            if (showImage) {
                show = false;
            } else {
                show = true;
            }
            this.setState({ showImage: show, fileDownloadUrl: activeCard.fileDownloadUrl });
        } else {
            Alert.alert('Kein Bild vorhanden',
                'Bei der Karteikartenanlage wurde kein Bild verknüpft.',
                [{ text: 'OK' }]);
        }

    }

    // set view mode edit/display
    _setEditMode = () => {
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
        var { cards, currentCount, maxCount, learnActive, ratings } = this.state;

        // set changed content if edit mode is active
        this._saveChangesInEditMode();

        // check if last entry is reached
        if (currentCount === cards.length) {
            // Learn Mode active
            if (learnActive) {

                this.props.navigation.navigate('LearnResultScreen', { ratings: ratings });
                //stop processing here because the learning-process is finished now
                return;
            }
            //Edit/View Mode active
            else {
                // start from the beginning again
                currentCount = 0;
            }
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

        // set changed content if edit mode is active
        this._saveChangesInEditMode();

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

        // read data asynchron from firebase db for specific CardDeck   
        let query = await Firebase.db.collection('user').doc(email).collection('subjects').doc(subjectName).collection('CardDecks').doc(activeCard.cardData.id).collection('cards').get();

        let cards = [];
        // add every read entry to array of cards
        query.forEach(card => {
            cards.push({
                id: card.id,
                question: card.data().question,
                answer: card.data().answer,
                fileDownloadUrl: card.data().fileDownloadUrl
            });
        });

        // set count for current card
        let currentCount = this._getIndexOfCurrentCard(cards, activeCard);
        let maxCount = cards.length;
        // set cards array to state and active card
        this.setState({ cardDeck: activeCard.cardData, cards: cards, activeCard: activeCard, question: activeCard.question, answer: activeCard.answer, currentCount: currentCount, maxCount: maxCount });

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

    //after a Card was rated
    _onFinishRating = (rating) => {
        let ratings = this.state.ratings;
        // check if rating is set        
        if (rating === 0) {
            this.refs.toast.show('Please evaluate the card before navigate');
            return;
        } else {
            ratings.push(rating);
            this.setState({ ratings: ratings }, () => this._nextCard());
        }
    }

    _saveChangesInEditMode = async () => {

        let { cards, cardDeck, question, answer, activeCard, currentCount, editMode } = this.state;

        // check if edit mode is active
        if (editMode) {
            let email = cardDeck.subjectData.userData.email;
            let subjectName = cardDeck.subjectData.name;

            // set changed question and answer
            cards[currentCount - 1].question = question;
            cards[currentCount - 1].answer = answer;
            // set updated cards array
            this.setState({ cards });

            // update edited answer and question within database
            try {
                await Firebase.db.collection('user').doc(email).collection('subjects').doc(subjectName).collection('CardDecks').doc(cardDeck.id).collection('cards').doc(activeCard.id).update({ answer: answer, question: question });
            } catch (error) {

            }
        }
    }

    _afterCardFlipped(oEvent) {
        debugger;
        let { questionActive } = this.state;
        if (questionActive) {
            this.setState({ questionActive: false });
        } else {
            this.setState({ questionActive: true });
        }

    }

    /* called after view is called */
    componentDidMount() {
        // init firebase object        
        Firebase.init();

        // set function to static navigation option parameter
        this.props.navigation.setParams({ setEditMode: this._setEditMode });
        this.props.navigation.setParams({ openImage: this._openImage });

        // set learn mode
        this.setState({ learnActive: this.props.navigation.getParam('learnActive') });

        // get the cards of the current deck
        this._retrieveCards();

        // add focus event, called every time the site is focused for navigation
        this.props.navigation.addListener('willFocus', () => {
            this._retrieveCards();
        });
    };

    render() {

        let { question, answer, currentCount, maxCount, learnActive, editMode, questionActive, showImage, fileDownloadUrl } = this.state;

        let content;
        // check if answer or question is active
        var cardValue;
        if (questionActive) {
            cardValue = question;
        } else {
            cardValue = answer;
        }


        if (editMode === false) {
            content =
                <CardFlip onFlip={() => this._afterCardFlipped()} visible={false} style={styles.cardContainer} ref={(card) => this.card = card} >
                    <TouchableOpacity activeOpacity={1} style={[styles.card, styles.card1]} onPress={() => this.card.flip()} ><Text style={styles.label}>{question}</Text></TouchableOpacity>
                    <TouchableOpacity activeOpacity={1} style={[styles.card, styles.card2]} onPress={() => this.card.flip()} ><Text style={styles.label}>{answer}</Text></TouchableOpacity>
                </CardFlip>
        } else {
            content =
                <View>
                    <TextInput value={question} style={styles.input} placeholder="Enter question" multiline={true} blurOnSubmit={true}
                        underlineColorAndroid="transparent" onChangeText={(value) => this.setState({ question: value })}>
                    </TextInput>
                    <TextInput value={answer} style={styles.input} placeholder="Enter answer" multiline={true} blurOnSubmit={true}
                        underlineColorAndroid="transparent" onChangeText={(value) => this.setState({ answer: value })}>
                    </TextInput>
                </View>
        }

        // set image  
        var images = [
            {
                source: {
                    uri: fileDownloadUrl,
                },
                title: 'Image',
                width: 450,
                height: 450,
            },
        ];

        return (
            <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
                <Text style={styles.counter}>{currentCount}/{maxCount}</Text>
                {/* set content depending on edit mode */}
                {content}
                <ImageView
                    images={images}
                    imageIndex={0}
                    isVisible={showImage}
                    onClose={() => this._openImage()}
                />

                {/* Do not show CardButtons if Learning is active */}
                <CardButtons hide={learnActive} openImage={this._openImage} previous={this._previousCard} next={this._nextCard} />

                {/* Show Rating bar with active learning */}
                <RatingBar visible={learnActive} cardValue={cardValue} onFinishRating={this._onFinishRating} defaultRating={1} maxRating={5} />
                {/* set toast object to show when neccessary*/}
                <Toast ref="toast"
                    position='center'
                    style={{ backgroundColor: 'red' }}
                    textStyle={{ color: 'black' }} />
            </KeyboardAvoidingView>
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
        flexDirection: 'row',
        width: 320,
        height: 400,
    },
    card: {
        flex: 1,
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
        justifyContent: 'center',
        alignItems: 'center'
    },
    card1: {
        backgroundColor: 'lightsalmon',
    },
    card2: {
        backgroundColor: 'lightgrey',
    },
    label: {
        textAlign: 'center',
        fontSize: 26,
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
    input: {
        borderWidth: 1,
        borderColor: 'lightsalmon',
        borderRadius: 4,
        fontSize: 20,
        padding: 10,
        marginBottom: 20,
        minHeight: 100,
        maxHeight: 150,
        minWidth: "80%",
        maxWidth: "80%"
    }
});

