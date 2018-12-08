import React, { Component } from 'react';
import { StyleSheet, ActivityIndicator, FlatList, Text, View, Button, TouchableOpacity } from 'react-native';
// import custom components
import SubjectListItem from '../components/SubjectListItem'
import NewSubject from '../components/NewSubject'
// import database
import Firebase from '../Firebase';

export default class SubjectListScreen extends Component {

    // set class states
    state = { userData: {}, showCreateSubjectScreen: false, subjects: [], isLoading: true };

    // set header toolbar title
    static navigationOptions = {
        title: "Smart Cards"
    }

    /* retrieve subjects from database */
    _retrieveSubjects = async () => {

        let subjects = [];
        // read data asynchron from friebase db
        let query = await Firebase.db.collection('subjects').get();
        // add every read entry to array of subjects
        query.forEach(subject => {
            subjects.push({
                id: subject.id,
                name: subject.data().name
            });
        });
        // neuen state setzen und loading indicator false setzen
        this.setState({ subjects, isLoading: false });
    }

    /* add new subject to list */
    _addSubject = (name) => {
        let { subjects } = this.state;
        // check if subject is not empty
        if (name) {
            // set subject name
            subjects.push({ name: name });
            // save quote within sql lite database
            this._saveSubjectToDB(name, subjects);
        }
        this.setState({ subjects, showCreateSubjectScreen: false });
    };

    /* save subjects to firebase DB */
    _saveSubjectToDB = async (name, subjects) => {

        try {
            // save data to database collection subjects
            docRef = await Firebase.db.collection('subjects').add({ name });
            // set new generated id to array entry
            subjects[subjects.length - 1].id = docRef.id;
        } catch (error) {
            alert('No internet connection');
        }
    }

    // refreshing list after swipe down
    _refresh = () => {
        this.setState({ isLoading: true });
        this._retrieveSubjects();
    }

    /* called after view is called */
    componentDidMount() {
        // init firebase object        
        Firebase.init();
        // set user data 
        debugger;
        const userData = this.props.navigation.getParam('userData');
        this.setState({ userData: userData });
        // get subjects for active user from firebase db
        this._retrieveSubjects();
    }

    // render view, depending on active state and props
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
            <View style={styles.container}>
                <FlatList
                    data={this.state.subjects}
                    keyExtractor={item => item.name}
                    ItemSeparatorComponent={() => <View style={styles.listSeparator} />}
                    ListEmptyComponent={() => (<Text style={styles.listEmpty}>No Data</Text>)}
                    refreshing={this.state.isLoading}
                    onRefresh={this._refresh}
                    renderItem={({ item }) => (
                        // render SubjectListItems
                        <SubjectListItem subject={item} onPress={() => this.props.navigation.navigate('SubjectDetailScreen', {
                            subject: item
                        })}></SubjectListItem>
                    )}
                />
                <View style={styles.createbuttonContainer}>
                    <TouchableOpacity style={styles.createButton} onPress={() => this.setState({ showCreateSubjectScreen: true })}>
                        <Text style={styles.createButtonText}>Create New Subject</Text>
                    </TouchableOpacity>
                </View>
                <NewSubject visible={this.state.showCreateSubjectScreen} onSave={this._addSubject} />
            </View >
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


