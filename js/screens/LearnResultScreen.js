import React, { Component } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { BarChart, XAxis } from 'react-native-svg-charts';
import * as scale from 'd3-scale';
// import icons
import Icon from 'react-native-vector-icons/MaterialIcons';

export default class LearnResultScreen extends Component {

    state = { averageRating: 0, ratings: [] };
    // set CardDeck title at runtime
    static navigationOptions = ({ navigation }) => {
        let CardDeck = navigation.getParam("CardDeck");

        return {
            headerLeft: (
                <Icon.Button name="keyboard-arrow-left"
                    underlayColor="transparent"
                    color="#007AFF"
                    iconStyle={{ marginRight: 0, fontSize: 40 }}
                    backgroundColor="transparent"
                    onPress={() => { navigation.navigate('CardScreen') }}>
                    {CardDeck.name}
                </Icon.Button>
            )
        };
    };
    // Called before the view is loaded
    componentWillMount() {
        //determine Ratingdata and write it into state
        this._determineResult();
    }

    render() {
        const ratings = this.state.ratings;
        const xAxisData = ["Schrecklich", "Schlecht", "OK", "Gut", "Perfekt"];
        const color = ["red", "orangered", "orange", "gold", "lightgreen"]
        let counter = 0;
        let data = [];

        //the rating array is sorted from terrible to perfect
        ratings.forEach(element => {
            data.push({
                value: element,
                svg: { fill: color[counter] }
            })
            counter++;
        });

        return (
            <View style={styles.container}>
                <View style={styles.result}>
                    {/* The array begins at 0 so the entry in xAxisData with the id averageRating - 1 is relevant  */}
                    <Text style={styles.resultText}>Dein Gesamtlernergebnis ist: {xAxisData[this.state.averageRating - 1]}</Text>
                </View>

                <BarChart
                    style={styles.barChart}
                    data={data}
                    // svg={{ fill: 'lightsalmon' }}
                    yAccessor={({ item }) => item.value}
                    contentInset={{ top: 10, bottom: 10 }}
                    xScale={scale.scaleBand}
                    gridMin={0}
                />

                <XAxis
                    style={{ marginTop: 10 }}
                    data={ratings}
                    scale={scale.scaleBand}
                    formatLabel={(_, index) => ratings[index]}
                    contentInset={{ top: 10, bottom: 10 }}
                    labelStyle={{ color: 'black' }}
                />
                <XAxis
                    style={{ marginTop: 10 }}
                    data={xAxisData}
                    scale={scale.scaleBand}
                    formatLabel={(_, index) => xAxisData[index]}
                    contentInset={{ top: 10, bottom: 10 }}
                    labelStyle={{ color: 'black' }}
                />

            </View>
        )
    }
    _determineResult = () => {
        let ratings = this.props.navigation.getParam('ratings');
        let ratingResult = [0, 0, 0, 0, 0];//count every category from the raiting
        let averageRating = this.state.averageRating;

        ratings.forEach(element => {
            ratingResult[element - 1] = ratingResult[element - 1] + 1;
            averageRating = averageRating + element;
        });
        averageRating = averageRating / ratings.length;

        averageRating = Math.round(averageRating);

        this.setState({ averageRating: averageRating, ratings: ratingResult });
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    barChart: {
        flex: 1,
    },
    badge: {
        flex: 1,
        backgroundColor: 'lightsalmon'
    },
    result: {
        marginTop: 10,
        justifyContent: 'flex-start',
        backgroundColor: "lightsalmon",
        alignItems: 'center',
        paddingVertical: 15,
        borderRadius: 40,
        marginBottom: 10
    },
    resultText: {
        textAlign: 'center',
        color: 'white',
        fontWeight: 'bold'
    },
    backButton: {
        flex: 1,
        flexDirection: "row"
    }

});