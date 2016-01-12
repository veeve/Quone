/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var _ = require('underscore');
var Contacts = require('react-native-contacts');

var Button = React.createClass({
  render: function() {
    return (
      <TouchableHighlight
        underlayColor={'white'}
        style={styles.button}
        onPress={this.props.onPress}>
        <Text style={styles.buttonLabel}>
          {this.props.label}
        </Text>
      </TouchableHighlight>
    );
  }
});

import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View,
  Image,
  ListView,
  ScrollView,
  TouchableHighlight,
  AlertIOS,
  PushNotificationIOS,
} from 'react-native';


var baseListView = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2,
});

var QuoneRN = React.createClass({
  getInitialState() {
    return {
      contacts: null,
      loaded: false,
      permission: 'unknown',
      selectedContact: null,
    };
  },

  componentDidMount() {
    this.fetchContacts();
  },

  componentWillMount() {
    PushNotificationIOS.addEventListener('notification', this.showNotification);
  },

  componentWillUnmount() {
    PushNotificationIOS.removeEventListener('notification', this.showNotification);
  },

  fetchContacts() {
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
        // add more dummy entries for testing purposes only
        // if (contacts.length < 10) {
        //   contacts = contacts.concat(_.map(contacts, c => {
        //     var d = _.clone(c); d.recordID *= 100; return d;
        //   }));
        // }
        // add test entry
        var testEntry = _.clone(contacts[0]);
        testEntry.givenName = 'Venkat';
        testEntry.familyName = 'Quone Test';
        testEntry.phoneNumbers[0].number = '6507406830';
        testEntry.recordID = 19642;
        contacts = contacts.concat([testEntry]);

        this.setState({
            loaded: true,
            permission: 'yes',
            contacts: this.getContactsRows(contacts)
        });
        console.log(this.state.contacts);
      }
    })
  },

  getContactsRows(contacts) {
    return _.map(contacts, c => {
      var phone = c.phoneNumbers[0] && c.phoneNumbers[0].number;
      var name = c.givenName;
      if (c.familyName) {
        name += " " + c.familyName;
      }
      return {
        thumbnail: c.thumbnailPath,
        name: name,
        phone: phone,
        id: c.recordID
      }
    });
  },

  requestLocation(event) {
    console.log('requestLocation for ');
    console.log(this.state.selectedContact);
    require('RCTDeviceEventEmitter').emit('remoteNotificationReceived', {
      aps: {
        alert: 'Requesting your location >> Allow | << Deny',
        badge: '+1',
        sound: 'default',
        category: 'QuoneLocation'
      },
    });
  },

  showNotification(notification) {
    AlertIOS.alert(
      'Notification Received',
      'Alert message: ' + notification.getMessage(),
      [{
        text: 'Dismiss',
        onPress: null,
      }]
    );
  },

  render() {
    if (!this.state.loaded) {
      return this.renderLoadingView();
    }

    if (this.state.permission === 'no') {
      return <Text>I dont have permission! </Text>;
    }

    if (this.state.selectedContact) {
      var contact = this.state.selectedContact;

      console.log(contact);

      return this.renderWithChrome(
        <View style={styles.container}>
          <View style={styles.rightContainer}>
            <Text style={styles.name}>{contact.name}</Text>
          </View>
          <Button
            onPress={this.requestLocation}
            label={'Request location!'}
          />
        </View>,
        true
      );
    }

    return this.renderWithChrome(
      <ScrollView
        onScroll={() => { console.log('onScroll!'); }}
        scrollEventThrottle={200}
        showsVerticalScrollIndicator={true}
        style={styles.scrollView}>
        {_.map(this.state.contacts, c => this.renderContact(c))}
      </ScrollView>
      // <ListView
      //   dataSource={baseListView.cloneWithRows(this.state.contacts)}
      //   renderRow={this.renderContact}
      //   style={styles.listView}
      // />
    );
  },

  renderLoadingView() {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  },

  renderContact(contact) {
    var onPress = __ => this.setState({selectedContact: contact});
    return (
      <TouchableHighlight onPress={onPress} key={contact.id}>
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
      <View style={styles.chrome}>
        <View style={styles.headerView}>
          <Text style={styles.headerText}>Quone</Text>
        </View>
        {content}
      </View>
    );
  }
});

const styles = StyleSheet.create({
  chrome: {
    flex: 1,
  },
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
  scrollView: {
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
  },
  button: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonLabel: {
    color: 'blue',
  },
});

AppRegistry.registerComponent('QuoneRN', () => QuoneRN);
