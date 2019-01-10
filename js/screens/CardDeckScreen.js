import React, { Component } from 'react';
import { Alert, ActivityIndicator, Button, Dimensions, View, FlatList, ScrollView, StyleSheet, Text } from 'react-native';
// import custom components
import CardDeckItem from '../components/CardDeckItem'
import NewCardDeck from '../components/NewCardDeck'
// import database
import Firebase from '../Firebase';
// import icons
import Icon from 'react-native-vector-icons/MaterialIcons';

export default class CardDeckScreen extends Component {

    state = { subject: {}, CardDecks: [], isLoading: true, showCreateCardDeckScreen: false };

    // set subject title at runtime
    static navigationOptions = ({ navigation }) => {
        const subject = navigation.getParam('subject');
        return {
            title: subject.name,
            headerRight: (
                <Icon.Button name="add" color="lightsalmon" size="30" iconStyle={{ marginRight: 0 }} backgroundColor="transparent" onPress={navigation.getParam('setCreateCardDeckScreen')}>
                </Icon.Button>
            )
        };
    };

    // hide creation card list screen
    _closeCreateCardDeckScreen = () => {
        this.setState({ showCreateCardDeckScreen: false });
    }

    // show creation card list screen
    _setCreateCardDeckScreen = () => {
        this.setState({ showCreateCardDeckScreen: true });
    }

    /* add new subject to list */
    _addCardDeck = (name, desc, examDate) => {

        let { CardDecks } = this.state;
        // check if card list name is empty
        if (name) {
            // set card list data
            CardDecks.push({ name: name, desc: desc, examDate: examDate });
            // save quote within sql lite database
            this._saveCardDeckToDB(name, desc, examDate, CardDecks);
        } else {
            Alert.alert('CardDeck name is empty',
                'Please enter a CardDeck name',
                [{ text: 'OK', style: 'cancel' }]);
        }
        this.setState({ CardDecks, showCreateCardDeckScreen: false });
    }

    /* save CardDeck to firebase DB */
    _saveCardDeckToDB = async (name, desc, examDate, CardDecks) => {

        let { subject } = this.state;

        try {
            // save data to database collection card lists            
            docRef = await Firebase.db.collection('user').doc(subject.userData.email).collection('subjects').doc(subject.name).collection('CardDecks').add({ name, desc, examDate });
            // set new generated id to array entry
            CardDecks[CardDecks.length - 1].id = docRef.id;
        } catch (error) {
            alert('No internet connection');
        }
        this.setState({ CardDecks });
    }

    /* refreshing list after swipe down */
    _refresh = () => {
        this.setState({ isLoading: true });
        this._retrieveCardDecks();
    }

    /* retrieve card lists from database */
    _retrieveCardDecks = async () => {

        // get active subject        
        let subject = this.props.navigation.getParam('subject');

        let CardDecks = [];
        // read data asynchron from firebase db                
        let query = await Firebase.db.collection('user').doc(subject.userData.email).collection('subjects').doc(subject.name).collection('CardDecks').get();

        // add every read entry to array of subjects
        query.forEach(CardDeck => {
            CardDecks.push({
                id: CardDeck.id,
                name: CardDeck.data().name,
                desc: CardDeck.data().desc,
                examDate: CardDeck.data().examDate,
                subjectData: subject

            });
        });
        // neuen state setzen und loading indicator false setzen
        this.setState({ subject, CardDecks, isLoading: false });
    }

    /* delete selected card list item from firebase DB */
    _deleteCardDeckItem = async (deleteRow) => {

        let { subject } = this.state;

        try {
            // add subject to specific user collection
            docRef = await Firebase.db.collection('user').doc(subject.userData.email).collection('subjects').doc(subject.name).collection('CardDecks').doc(deleteRow).delete();
            // set new generated id to array entry
            this.setState({ isLoading: true });
            this._retrieveCardDecks();

            //subjects[subjects.length - 1].id = docRef.id;
        } catch (error) {
            alert('CardDeck does not exist');
        }
    }

    /* called after view is called */
    componentDidMount() {
        // set function to static navigation option parameter
        this.props.navigation.setParams({ setCreateCardDeckScreen: this._setCreateCardDeckScreen });
        // init firebase object        
        Firebase.init();
        // get CardDecks for active user from firebase db
        this._retrieveCardDecks();
    }

    render() {

        // set loading indicator, if isLoading is true
        if (this.state.isLoading) {
            return (
                <View style={styles.container}>
                    <ActivityIndicator />
                </View>
            )
        }

        return (
            <ScrollView contentContainerStyle={styles.container} style={styles.scrollView}>
                <View style={styles.container}>
                    <FlatList
                        data={this.state.CardDecks}
                        keyExtractor={item => item.id}
                        ItemSeparatorComponent={() => <View style={styles.listSeparator} />}
                        ListEmptyComponent={() => (<Text style={styles.listEmpty}>No Card Deck exists</Text>)}
                        refreshing={this.state.isLoading}
                        onRefresh={this._refresh}
                        renderItem={({ item, index }) => (
                            // render CardDeckItems
                            <CardDeckItem CardDeck={item} index={index} onDelete={this._deleteCardDeckItem} onPress={() => this.props.navigation.navigate('CardScreen', {
                                CardDeck: item
                            })}></CardDeckItem>
                        )}
                    />
                    <NewCardDeck visible={this.state.showCreateCardDeckScreen} onSave={this._addCardDeck} onCancel={this._closeCreateCardDeckScreen} />
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#fff',
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

