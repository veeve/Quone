/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var _ = require('underscore');
var Contacts = require('react-native-contacts');
console.log(Contacts);

import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View,
  Image,
  ListView,
} from 'react-native';

var MOCKED_MOVIES_DATA = [
  {title: 'Title', year: '2015', posters: {thumbnail: 'http://i.imgur.com/UePbdph.jpg'}},
];

var REQUEST_URL = 'https://raw.githubusercontent.com/facebook/react-native/master/docs/MoviesExample.json';

var QuoneRN = React.createClass({
  getInitialState: function() {
    return {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      loaded: false,
    };
  },

  componentDidMount: function() {
   this.fetchData();
  },

  fetchData: function() {
    Contacts.getAll((err, contacts) => {
      if(err && err.type === 'permissionDenied'){
        console.log('permissionDenied!')
      } else {
        console.log(contacts)
      }
    })
    // fetch(REQUEST_URL)
    //   .then((response) => response.json())
    //   .then((responseData) => {
    //     console.log(responseData);
    //     this.setState({
    //       dataSource: this.state.dataSource.cloneWithRows(responseData.movies),
    //       loaded: true,
    //     });
    //   })
    //   .done();
  },

  render: function() {
    if (!this.state.loaded) {
      return this.renderLoadingView();
    }

    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this.renderMovie}
        style={styles.listView}
      />
    );
  },

  renderLoadingView: function() {
    return (
      <View style={styles.container}>
      <Text>
      Loading movies...
      </Text>
      </View>
    );
  },

  renderMovie: function(movie) {
    return (
      <View style={styles.container}>
      <Image
      source={{uri: movie.posters.thumbnail}}
      style={styles.thumbnail}
      />
      <View style={styles.rightContainer}>
      <Text style={styles.title}>{movie.title}</Text>
      <Text style={styles.year}>{movie.year}</Text>
      <Text> {
        _.map([1,2,3], num => "S" + num).join(", ")
       } </Text>
      </View>
      </View>
    );
  },

  // render() {
  //   var movie = MOCKED_MOVIES_DATA[0];
  //   return (
  //      <View style={styles.container}>
  //        <Image
  //          source={{uri: movie.posters.thumbnail}}
  //          style={styles.thumbnail}
  //        />
  //        <View style={styles.rightContainer}>
  //          <Text style={styles.title}>{movie.title}</Text>
  //          <Text style={styles.year}>{movie.year}</Text>
  //        </View>
  //      </View>
  //    );
  // }

});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  rightContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  year: {
    textAlign: 'center',
  },
  thumbnail: {
    width: 53,
    height: 81,
  },
  listView: {
    paddingTop: 20,
    backgroundColor: '#F5FCFF',
  },
});

AppRegistry.registerComponent('QuoneRN', () => QuoneRN);
