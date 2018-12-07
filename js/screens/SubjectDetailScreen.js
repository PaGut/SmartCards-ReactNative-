import React, { Component } from 'react';
import { ActivityIndicator, Dimensions, View, FlatList, TouchableOpacity, ScrollView, StyleSheet, Text } from 'react-native';
// import custom components
import CardListItem from '../components/CardListItem'
import NewCardList from '../components/NewCardList'
// import database
import Firebase from '../Firebase';

export default class SubjectDetailScreen extends Component {

    state = { cardLists: [], isLoading: true, showCreateCardListScreen: false };

    // set subject title at runtime// titel zur Laufzeit setzen
    static navigationOptions = ({ navigation }) => {
        const subject = navigation.getParam('subject');
        return {
            title: subject.name
        };
    };

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
            alert("Please set name for CardList");
        }
        this.setState({ cardLists, showCreateCardListScreen: false });
    }

    /* save cardList to firebase DB */
    _saveCardListToDB = async (name, desc, examDate, cardLists) => {

        try {
            // save data to database collection subjects
            docRef = await Firebase.db.collection('cardList').add({ name, desc, examDate });
            // set new generated id to array entry
            cardLists[subjects.length - 1].id = docRef.id;
        } catch (error) {
            alert('No internet connection');
        }
    }

    /* refreshing list after swipe down */
    _refresh = () => {
        this.setState({ isLoading: true });
        this._retrieveCardLists();
    }

    /* retrieve card lists from database */
    _retrieveCardLists = async () => {

        let cardLists = [];
        // read data asynchron from friebase db
        let query = await Firebase.db.collection('cardLists').get();
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
        this.setState({ cardLists, isLoading: false });
    }

    /* called after view is called */
    componentDidMount() {
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

        return (
            <ScrollView contentContainerStyle={styles.container} style={styles.scrollView}>
                <View style={styles.container}>
                    <FlatList
                        data={this.state.cardLists}
                        keyExtractor={item => item.name}
                        ItemSeparatorComponent={() => <View style={styles.listSeparator} />}
                        ListEmptyComponent={() => (<Text style={styles.listEmpty}>No Data</Text>)}
                        refreshing={this.state.isLoading}
                        onRefresh={this._refresh}
                        renderItem={({ item }) => (
                            // render CardListItems
                            <CardListItem cardList={item} onPress={() => this.props.navigation.navigate('CardListItem', {
                                cardList: item
                            })}></CardListItem>
                        )}
                    />
                    <View style={styles.createbuttonContainer}>
                        <TouchableOpacity style={styles.createButton} onPress={() => this.setState({ showCreateCardListScreen: true })}>
                            <Text style={styles.createButtonText}>Create New CardList</Text>
                        </TouchableOpacity>
                    </View>
                    <NewCardList visible={this.state.showCreateCardListScreen} onSave={this._addCardList} />
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
    },
    createbuttonContainer: {
        backgroundColor: 'white'
    },
    createButton: {
        marginTop: 10,
        marginHorizontal: 20,
        borderTopWidth: 1,
        borderColor: "lightsalmon",
        backgroundColor: "lightsalmon",
        alignItems: 'center',
        paddingVertical: 15,
        borderRadius: 40,
        marginBottom: 10
    },
    createButtonText: {
        textAlign: 'center',
        color: 'white',
        fontWeight: 'bold'
    }
});

