import React, { Component } from 'react';
import { Alert, ActivityIndicator, Dimensions, View, FlatList, TouchableOpacity, ScrollView, StyleSheet, Text } from 'react-native';
// import database
import Firebase from '../Firebase';

export default class CardListScreen extends Component {

    // state = { userData: {}, showCreateSubjectScreen: false, subjects: [], isLoading: true };

    // set cardList title at runtime
    static navigationOptions = ({ navigation }) => {
        const cardList = navigation.getParam('cardList');
        return {
            title: cardList.name
        };
    };

    /* called after view is called */
    componentDidMount() {
        // init firebase object        
        Firebase.init();
    }

    render() {
        debugger;
        return (
            <View style={styles.container}>


                {/* <FlatList
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
                /> */}


                <Text>Dann Hau mal rein :D</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'red',
    }
});

