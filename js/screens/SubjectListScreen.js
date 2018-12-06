import React, { Component } from 'react';
import { StyleSheet, ActivityIndicator, FlatList, Text, View, Button, TouchableOpacity } from 'react-native';
// import custom components
import SubjectListItem from '../components/SubjectListItem'
// import database
import Firebase from '../Firebase';

export default class SubjectListScreen extends Component {

    // set header toolbar title
    static navigationOptions = {
        title: "Smart Cards"
    }

    // set class states
    state = { subjects: [], isLoading: true };

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
        this.setState({ subjects });
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
        // TODO check login data
        // get subjects for active user from firebase db
        this._retrieveSubjects();
    }

    // erstellt Benutzeroberfläche, abhängig von denen im state gesetzten Variablen
    render() {

        // set loading indicator, if isLoading is true
        if (this.state.isLoading) {
            return (
                <View style={styles.container}>
                    <ActivityIndicator />
                </View>
            )
        }
        // Parameter übergabe aktuell undefined, eventuell als einen Stack definieren, kennt sich wohl übergreifend nicht
        debugger;
        console.log(this.props.navigation.getParam('userData'));
        const userData = this.props.navigation.getParam('userData');

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
                    <TouchableOpacity style={styles.createButton} onPress={() => this._addSubject("Fach 7")}>
                        <Text style={styles.createButtonText}>Create New Subject</Text>
                    </TouchableOpacity>
                </View>
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
        backgroundColor: 'lightsalmon'
    },
    createButton: {
        marginTop: 10,
        marginHorizontal: 20,
        borderTopWidth: 1,
        borderColor: "white",
        backgroundColor: "white",
        alignItems: 'center',
        paddingVertical: 15,
        borderRadius: 40,
        marginBottom: 10
    },
    createButtonText: {
        textAlign: 'center',
        color: 'lightsalmon',
        fontWeight: 'bold'
    }
});


