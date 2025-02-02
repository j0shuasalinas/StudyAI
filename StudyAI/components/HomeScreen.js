import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Image, TouchableOpacity } from 'react-native';
import logo from '../assets/logo.png'; // For local assets


const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleLogin = () => {
    Alert.alert('Home Pressed', `Email: ${email}, Password: ${password}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <View style={styles.logoContainer}>
          <Image source={logo} style={styles.image} />
        </View>

        {/* Navigation Bar */}
        <View style={styles.navBar}>
          <TouchableOpacity>
            <Text style={styles.navItem}>  Dashboard</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.navItem}>Assignments</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
            <Text style={styles.navItem}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Welcome')}>
            <Text style={styles.navItem}>W</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Introduction Section */}
      <View style={styles.introContainer}>
        <Text style={styles.intro}>Welcome ${name} to DuckyBrain</Text>
      </View>

      </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, marginBottom: 20, marginTop: -60 },
  input: { width: 200, height: 40, borderWidth: 1, marginBottom: 10, padding: 8 },
  intro: { fontSize: 24},
  image: { 
    width: 50, // Adjust size of the image
    height: 50, // Adjust size of the image
    // marginBottom: 100, // Space between image and title
    borderRadius: 25,
  },
  topBar: {
    flexDirection: 'row', // Arrange logo and nav bar horizontally
    alignItems: 'center', // Align vertically in the center
    position: 'absolute', // To position this at the top
    top: 10, // Adjust the top position
    left: 10, // Adjust the left position
    width: '100%', // Ensure it takes full width
  },
  logoContainer: {
    
    top: 0,  // Move it to the top of the screen
    left: 0, // Move it to the left of the screen
    margin: -10, // Add some margin for spacing from edges
  },
  navBar: {
    flexDirection: 'row', // Arrange nav items horizontally
  },
  navItem: {
    marginRight: 10, // Space between nav items
    fontSize: 18,
    color: '#000',
  },
  
});

export default LoginScreen;