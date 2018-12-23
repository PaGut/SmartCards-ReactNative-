import React, { Component } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Swipeout from 'react-native-swipeout';


export default class CardListItem extends Component {

    constructor(props) {
        super(props);
        this.state = { activeRowKey: null };
    }

    render() {
        const { cardList, onPress, onDelete } = this.props;

        const swipeSettings = {
            autoClose: true,
            onClose: (secId, rowId, direction) => {
                if (this.state.activeRowKey != null) {
                    this.setState({ activeRowKey: null });
                }
            },
            onOpen: (secId, rowId, direction) => {
                this.setState({ activeRowKey: this.props.cardList.id });
            },
            right: [
                {
                    onPress: () => {
                        const deletingRow = this.state.activeRowKey;
                        Alert.alert(
                            'Delete',
                            'Are you sure you want to delete?',
                            [
                                { text: 'No', onPress: () => console.log('Canceled'), style: 'cancel' },
                                {
                                    text: 'Yes', onPress: () => {
                                        onDelete(deletingRow);
                                    }
                                },
                            ],
                            { cancelable: true }
                        );
                    },
                    text: 'Delete', type: 'delete'
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
                            <View style={styles.infoRow}>
                                <Text style={styles.text}>{cardList.name}</Text>
                            </View>
                            <Text style={styles.text}>{this._formatDate(cardList.examDate)}</Text>
                            <Text style={styles.text}>{cardList.desc}</Text>
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
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    text: {
        fontSize: 20
    },
    textSmall: {
        fontSize: 16,
        fontWeight: '100'
    }
})