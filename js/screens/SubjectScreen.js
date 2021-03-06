import React, { Component } from 'react';
import { Alert, StyleSheet, ActivityIndicator, FlatList, Text, View } from 'react-native';
// import custom components
import SubjectListItem from '../components/SubjectListItem'
import NewSubject from '../components/NewSubject'
// import database
import Firebase from '../Firebase';
// import icons
import Icon from 'react-native-vector-icons/MaterialIcons';

export default class SubjectScreen extends Component {

    // set class states
    state = { userData: {}, showCreateSubjectScreen: false, subjects: [], isLoading: true };

    // set header toolbar title
    static navigationOptions = ({ navigation }) => {
        return {
            title: "Lernfächer",
            headerRight: (
                <Icon.Button iconStyle={{ marginRight: 0 }} name="add" color="lightsalmon" size="30" backgroundColor="transparent" onPress={navigation.getParam('setCreateSubjectScreen')}>
                </Icon.Button>
            )
        }
    }

    // set subject create screen
    _setCreateSubjectScreen = () => {
        this.setState({ showCreateSubjectScreen: true });
    }

    /* retrieve subjects from database */
    _retrieveSubjects = async () => {

        // get user data
        const userData = this.props.navigation.getParam('userData');

        let subjects = [];
        // read data asynchron from friebase db for specific user   
        let query = await Firebase.db.collection('user').doc(userData.email).collection('subjects').get();
        // add every read entry to array of subjects
        query.forEach(subject => {
            subjects.push({
                id: subject.id,
                name: subject.data().name,
                userData: subject.data().userData
            });
        });
        // neuen state setzen und loading indicator false setzen
        this.setState({ userData, subjects, isLoading: false });
    }

    /* add new subject to list */
    _addSubject = (name) => {

        let { userData, subjects } = this.state;

        // check if subject is not empty
        if (name) {
            // set subject name
            subjects.push({ name: name, userData: userData });
            // save quote within sql lite database
            this._saveSubjectToDB(userData, name, subjects);
        }
        this.setState({ subjects, showCreateSubjectScreen: false });
    };

    /* save subjects to firebase DB */
    _saveSubjectToDB = async (userData, name, subjects) => {

        try {
            // add subject to specific user collection
            docRef = await Firebase.db.collection('user').doc(userData.email).collection('subjects').add({ name, userData });
            // set new generated id to array entry
            subjects[subjects.length - 1].id = docRef.id;
        } catch (error) {
            alert('Keine Internetverbindung, Service-Aufruf fehlgeschlagen.');
        }
    }

    /* delete selected subject from firebase DB */
    _deleteSubjectItem = async (deleteRow) => {

        let { userData } = this.state;

        try {
            // add subject to specific user collection
            docRef = await Firebase.db.collection('user').doc(userData.email).collection('subjects').doc(deleteRow).delete();
            // set new generated id to array entry
            this.setState({ isLoading: true });
            this._retrieveSubjects();

            //subjects[subjects.length - 1].id = docRef.id;
        } catch (error) {
            alert('Fach existiert nicht');
        }
    }

    // refreshing list after swipe down
    _refresh = () => {
        this.setState({ isLoading: true });
        this._retrieveSubjects();
    }

    _closeCreationScreen = () => {
        this.setState({ showCreateSubjectScreen: false });
    }

    /* called after view is called */
    componentDidMount() {
        // set function to static navigation option parameter
        this.props.navigation.setParams({ setCreateSubjectScreen: this._setCreateSubjectScreen });
        // init firebase object        
        Firebase.init();
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
                    ListEmptyComponent={() => (<Text style={styles.listEmpty}>Bitte erstellen Sie Ihr erstes Lernfach</Text>)}
                    refreshing={this.state.isLoading}
                    onRefresh={this._refresh}
                    renderItem={({ item, index }) => (
                        // render SubjectListItems
                        <SubjectListItem subject={item} index={index} onDelete={this._deleteSubjectItem} onPress={() => this.props.navigation.navigate('CardDeckScreen', {
                            subject: item
                        })}></SubjectListItem>
                    )}
                />
                <NewSubject visible={this.state.showCreateSubjectScreen} onSave={this._addSubject} onCancel={this._closeCreationScreen} />
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
    }
});


