import React, { Component } from 'react';
import { View, StyleSheet, Badge, Text } from 'react-native';
import { BarChart, XAxis } from 'react-native-svg-charts';
import * as scale from 'd3-scale';

export default class LearnResultScreen extends Component {

    state = { averageRating: 0, ratings: [] };
    // Called before the view is loaded
    componentWillMount() {

        //determine Ratingdata and write it into state
        this._determineResult();
    }

    render() {
        const ratings = this.state.ratings;
        const xAxisData = ["Terrible", "Bad", "OK", "Good", "Perfect"];

        return (
            <View style={styles.container}>
                <View style={styles.result}>
                    {/* The array begins at 0 so the entry in xAxisData with the id averageRating - 1 is relevant  */}
                    <Text style={styles.resultText}>Your overall Learning Result is: {xAxisData[this.state.averageRating - 1]}</Text>
                </View>

                <BarChart
                    style={styles.barChart}
                    data={ratings}
                    svg={{ fill: 'lightsalmon' }}
                    yAccessor={({ item }) => item.value}
                    contentInset={{ top: 10, bottom: 10 }}
                    xScale={scale.scaleBand}
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
        //let ratingResult = [0, 0, 0, 0, 0];//count every category from the raiting
        let ratingResult = [];
        let result = { value: 0, svg: { fill: null } };
        let averageRating = this.state.averageRating;

        ratings.forEach(element => {
            result = ratingResult[element - 1];

            result.value = result.value + 1;
            result.svg.fill = 'rgba(134, 65, 244, 0.5)';
            ratingResult[element - 1] = result;
            // ratingResult[element - 1].value = ratingResult[element - 1].value + 1;
            // ratingResult[element - 1].svg = {
            //     fill: 'rgba(134, 65, 244, 0.5)'
            // };
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
    }

});