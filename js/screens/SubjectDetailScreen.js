import React, { Component } from 'react';
import { Alert, ActivityIndicator, Button, Dimensions, View, FlatList, ScrollView, StyleSheet, Text } from 'react-native';
// import custom components
import CardListItem from '../components/CardListItem'
import NewCardList from '../components/NewCardList'
// import database
import Firebase from '../Firebase';

export default class SubjectDetailScreen extends Component {

    state = { subject: {}, cardLists: [], isLoading: true, showCreateCardListScreen: false };

    // set subject title at runtime
    static navigationOptions = ({ navigation }) => {
        const subject = navigation.getParam('subject');
        return {
            title: subject.name,
            headerRight: (
                <Button
                    onPress={navigation.getParam('setCreateCardListScreen')}
                    title="Create"
                    color="lightsalmon"
                />
            )
        };
    };

    // hide creation card list screen
    _closeCreateCardListScreen = () => {
        this.setState({ showCreateCardListScreen: false });
    }

    // show creation card list screen
    _setCreateCardListScreen = () => {
        this.setState({ showCreateCardListScreen: true });
    }

    /* add new subject to list */
    _addCardList = (name, desc, examDate) => {

        let { cardLists } = this.state;
        // check if card list name is empty
        if (name) {
            // set card list data
            cardLists.push({ name: name, desc: desc, examDate: examDate });
            // save quote within sql lite database
            this._saveCardListToDB(name, desc, examDate, cardLists);
        } else {
            Alert.alert('CardList name is empty',
                'Please enter a CardList name',
                [{ text: 'OK', style: 'cancel' }]);
        }
        this.setState({ cardLists, showCreateCardListScreen: false });
    }

    /* save cardList to firebase DB */
    _saveCardListToDB = async (name, desc, examDate, cardLists) => {

        let { subject } = this.state;

        try {
            // save data to database collection card lists            
            docRef = await Firebase.db.collection('user').doc(subject.userData.email).collection('subjects').doc(subject.name).collection('cardLists').add({ name, desc, examDate });
            // set new generated id to array entry
            cardLists[cardLists.length - 1].id = docRef.id;
        } catch (error) {
            alert('No internet connection');
        }
        this.setState({ cardLists });
    }

    /* refreshing list after swipe down */
    _refresh = () => {
        this.setState({ isLoading: true });
        this._retrieveCardLists();
    }

    /* retrieve card lists from database */
    _retrieveCardLists = async () => {

        // get active subject        
        let subject = this.props.navigation.getParam('subject');

        let cardLists = [];
        // read data asynchron from firebase db                
        let query = await Firebase.db.collection('user').doc(subject.userData.email).collection('subjects').doc(subject.name).collection('cardLists').get();

        // add every read entry to array of subjects
        query.forEach(cardList => {
            cardLists.push({
                id: cardList.id,
                name: cardList.data().name,
                desc: cardList.data().desc,
                examDate: cardList.data().examDate
            });
        });

        // neuen state setzen und loading indicator false setzen
        this.setState({ subject, cardLists, isLoading: false });
    }

    /* delete selected card list item from firebase DB */
    _deleteCardListItem = async (deleteRow) => {

        let { subject } = this.state;

        try {
            // add subject to specific user collection
            docRef = await Firebase.db.collection('user').doc(subject.userData.email).collection('subjects').doc(subject.name).collection('cardLists').doc(deleteRow).delete();
            // set new generated id to array entry
            this.setState({ isLoading: true });
            this._retrieveCardLists();

            //subjects[subjects.length - 1].id = docRef.id;
        } catch (error) {
            alert('CardList does not exist');
        }
    }


    /* called after view is called */
    componentDidMount() {
        // set function to static navigation option parameter
        this.props.navigation.setParams({ setCreateCardListScreen: this._setCreateCardListScreen });
        // init firebase object        
        Firebase.init();
        // get cardLists for active user from firebase db
        this._retrieveCardLists();
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
        debugger;
        return (
            <ScrollView contentContainerStyle={styles.container} style={styles.scrollView}>
                <View style={styles.container}>
                    <FlatList
                        data={this.state.cardLists}
                        keyExtractor={item => item.id}
                        ItemSeparatorComponent={() => <View style={styles.listSeparator} />}
                        ListEmptyComponent={() => (<Text style={styles.listEmpty}>No Data</Text>)}
                        refreshing={this.state.isLoading}
                        onRefresh={this._refresh}
                        renderItem={({ item, index }) => (
                            // render CardListItems
                            <CardListItem cardList={item} index={index} onDelete={this._deleteCardListItem} onPress={() => this.props.navigation.navigate('CardListScreen', {
                                cardList: item
                            })}></CardListItem>
                        )}
                    />
                    <NewCardList visible={this.state.showCreateCardListScreen} onSave={this._addCardList} onCancel={this._closeCreateCardListScreen} />
                </View >
            </ScrollView>
        );
    }
}

//Dynamische Breite anhand des Windows berechnen
const width = Dimensions.get('window').width * 0.75;

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

