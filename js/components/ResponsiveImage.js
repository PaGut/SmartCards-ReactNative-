import React, { Component } from 'react';
import { Image, Dimensions } from 'react-native';

export default class ResponsiveImage extends Component {
    render() {
        let { source, width, height } = this.props;
        let windowWidth = Dimensions.get("window").width;
        let widthChange = windowWidth / width;
        let newWidth = width * widthChange;
        let windowHeight = Dimensions.get("window").height / 2; // the picture has only the top half of the screen so divide by 2 
        let heightChange = windowHeight / height;
        let newHeight = height * heightChange;
        return (
            <Image source={source} style={{ width: newWidth, height: newHeight, resizeMode: 'contain' }} />
        )
    }
}