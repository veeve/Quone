/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

// Venkat's  iPhone udid = 'f9b65f9b32899d1f5785c499412063450afbc876';

var _ = require('underscore');
var Contacts = require('react-native-contacts');

import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View,
  Image,
  ListView,
} from 'react-native';

var QuoneRN = React.createClass({
  getInitialState: function() {
    return {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      loaded: false,
      permission: 'unknown',
    };
  },

  componentDidMount: function() {
   this.fetchData();
  },

  fetchData: function() {
    Contacts.getAll((err, contacts) => {
      if(err && err.type === 'permissionDenied'){
        this.setState({
            loaded: true,
            permission: 'no',
        });
        console.log('permissionDenied!')
      } else if (err) {
        console.log(err);
        // should probably show an error message in the ui
      } else {
        console.log(contacts)
        this.setState({
            loaded: true,
            permission: 'yes',
            contacts: contacts
        });
      }
    })
  },

  render: function() {
    if (!this.state.loaded) {
      return this.renderLoadingView();
    }

    if (this.state.permission === 'no') {
      return <Text>I don{"'"}t have permission!</Text>
    }

    console.log(this.state.contacts);
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    var rows = _.map(this.state.contacts, c => {
      var phone = c.phoneNumbers[0] && c.phoneNumbers[0].number;
      return {
        thumbnail: c.thumbnailPath,
        name: c.givenName + " " + c.familyName,
        phone: phone
      }
    });

    return (
      <ListView
        dataSource={ds.cloneWithRows(rows)}
        renderRow={this.renderContact}
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

  renderContact: function(contact) {
    return (
      <View style={styles.container}>
      <Image
      source={{uri: contact.thumbnail || null}}
      style={styles.thumbnail}
      />
      <View style={styles.rightContainer}>
      <Text style={styles.title}>{contact.name}</Text>
      <Text style={styles.year}>{contact.phone}</Text>
      </View>
      </View>
    );
  },
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
