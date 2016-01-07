/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

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
  TouchableHighlight
} from 'react-native';


var baseListView = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2,
});

var QuoneRN = React.createClass({
  getInitialState: function() {
    return {
      contacts: null,
      loaded: false,
      permission: 'unknown',

      selectedContact: null,
    };
  },

  componentDidMount: function() {
    this.fetchContacts();
  },

  fetchContacts: function() {
    Contacts.getAll((err, contacts) => {
      if (err && err.type === 'permissionDenied'){
        console.log('permission denied!')
        this.setState({
          loaded: true,
          permission: 'no',
        });
      } else if (err) {
        console.log(err);
        // should probably show an error message in the ui
      } else {
        console.log(contacts)
        this.setState({
            loaded: true,
            permission: 'yes',
            contacts: this.getContactsRows(contacts)
        });
      }
    })
  },

  getContactsRows(contacts) {
    return _.map(contacts, c => {
      var phone = c.phoneNumbers[0] && c.phoneNumbers[0].number;
      return {
        thumbnail: c.thumbnailPath,
        name: c.givenName + " " + c.familyName,
        phone: phone,
        id: c.recordID
      }
    });
  },

  render: function() {
    if (!this.state.loaded) {
      return this.renderLoadingView();
    }

    if (this.state.permission === 'no') {
      return <Text>I don{"'"}t have permission!</Text>;
    }

    if (this.state.selectedContact) {
      var contact = _.filter(this.state.contacts, c => c.id === this.state.selectedContact)[0];
      console.log(this.state.selectedContact);
      console.log(_.pluck(this.state.contacts, 'id'));
      console.log(contact);

      return this.renderWithChrome(
        <Text>{'TODO' + contact.name}</Text>,
        true
      );
    }

    return this.renderWithChrome(
      <ListView
        dataSource={baseListView.cloneWithRows(this.state.contacts)}
        renderRow={this.renderContact}
        style={styles.listView}
      />
    );
  },

  renderLoadingView: function() {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  },

  renderContact: function(contact) {
    var onPress = __ => this.setState({selectedContact: contact.id});
    return (
      <TouchableHighlight onPress={onPress}>
        <View style={styles.container}>
          <View style={styles.rightContainer}>
            <Text style={styles.name}>{contact.name}</Text>
            <Text style={styles.phone}>{contact.phone}</Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  },

  renderWithChrome(content, hasBackButton = false) {
    var backButton = null;
    if (hasBackButton) {
      // TODO  
    }

    // TODO: make a component
    return (
      <View>
        <View style={styles.headerView}>
          <Text style={styles.headerText}>Quone</Text>
        </View>
        {content}
      </View>
    );
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: 'rgb(200, 198, 204)',
    marginLeft: 15,
    paddingBottom: 8,
    paddingTop: 8,
  },
  rightContainer: {
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
  },
  phone: {
  },
  thumbnail: {
    width: 53,
    height: 81,
  },
  listView: {
    paddingTop: 20,
  },
  headerView: {
    backgroundColor: '#F9F9F9',
    height: 62,
    borderBottomWidth: 1,
    borderColor: 'rgb(200, 198, 204)',
    paddingTop: 25,
    paddingLeft: 6,
  },
  headerText: {
    fontSize: 20
  }
});

AppRegistry.registerComponent('QuoneRN', () => QuoneRN);
