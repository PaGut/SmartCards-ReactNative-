import React, { Component } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Swipeout from 'react-native-swipeout';

export default class Card extends Component {

    constructor(props) {
        super(props);
        this.state = { activeRowKey: null };
    }

    render() {

        const { card, onPress, onDelete } = this.props;

        const swipeSettings = {
            autoClose: true,
            onClose: (secId, rowId, direction) => {
                if (this.state.activeRowKey != null) {
                    this.setState({ activeRowKey: null });
                }
            },
            onOpen: (secId, rowId, direction) => {
                this.setState({ activeRowKey: this.props.card.id });
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
                        <Image style={styles.image} source={require("../../assets/Card.png")} />
                        <View style={styles.infoColumn}>
                            <View style={styles.infoRow}>
                                <Text style={styles.text}>{card.question}</Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </Swipeout>
        )
    }
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

