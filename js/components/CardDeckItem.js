import React, { Component } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Swipeout from 'react-native-swipeout';


export default class CardDeckItem extends Component {

    constructor(props) {
        super(props);
        this.state = { activeRowKey: null };
    }

    render() {
        const { CardDeck, onPress, onDelete } = this.props;

        const swipeSettings = {
            autoClose: true,
            onClose: (secId, rowId, direction) => {
                if (this.state.activeRowKey != null) {
                    this.setState({ activeRowKey: null });
                }
            },
            onOpen: (secId, rowId, direction) => {
                this.setState({ activeRowKey: this.props.CardDeck.id });
            },
            right: [
                {
                    onPress: () => {
                        const deletingRow = this.state.activeRowKey;
                        Alert.alert(
                            'Löschen',
                            'Möchten Sie das Objekt wirklich löschen?',
                            [
                                { text: 'Nein', onPress: () => console.log('Canceled'), style: 'cancel' },
                                {
                                    text: 'Ja', onPress: () => {
                                        onDelete(deletingRow);
                                    }
                                },
                            ],
                            { cancelable: true }
                        );
                    },
                    text: 'Löschen', type: 'delete'
                }
            ],
            rowId: this.props.index,
            sectionId: 1
        };

        return (
            <Swipeout {...swipeSettings}>
                <TouchableOpacity onPress={onPress}>
                    <View style={styles.container}>
                        <Image style={styles.image} source={require("../../assets/CardSet.jpg")} />
                        <View style={styles.infoColumn}>
                            <Text style={styles.textCardName}>{CardDeck.name}</Text>
                            <Text style={styles.text}>{this._formatDate(CardDeck.examDate)}</Text>
                            <Text style={styles.text}>{CardDeck.desc}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </Swipeout>
        )
    };

    _formatDate = (date) => {
        helperDate = new Date(date);

        //prepare day for display-format
        let day = helperDate.getDate();
        //add leading 0 if needed
        if (String(day).length == 1) {
            day = '0' + day;
        }

        //prepare month for display-format
        let month = helperDate.getMonth() + 1;//month-count starts with 0
        //add leading 0 if needed
        if (String(month).length == 1) {
            month = '0' + month;
        }

        //determine year
        let year = helperDate.getFullYear();

        // Format to DD.MM.YYYY
        let formatedDate = day + '.' + month + '.' + year;

        return (
            formatedDate
        );

    };

}


const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: 'white'
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginRight: 10
    },
    text: {
        marginLeft: 40,
        marginTop: 20
    },
    infoColumn: {
        flexDirection: 'column',
        justifyContent: 'space-evenly'
    },
    textCardName: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    text: {
        fontSize: 16
    }
})