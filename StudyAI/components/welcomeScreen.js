import { View, Text, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

export default function WelcomeScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#5033cd' }}>
      <View style={{ flex: 1, justifyContent: 'center', marginHorizontal: 16 }}>
        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 32, textAlign: 'center' }}>
          
        </Text>
        <View style={{ alignItems: 'center' }}>
          <Image 
            source={require("../assets/logo.png")} // Ensure correct path to the image
            style={{ width: 350, height: 350 }} // Adjust image size
          />
        </View>
        <View style={{ marginTop: 24 }}>
          <TouchableOpacity 
            onPress={() => navigation.navigate('SignUp')}
            style={{
              fontFamily: 'Afacad',
              paddingVertical: 12,
              backgroundColor: '#f95553', // Yellow color
              marginHorizontal: 28,
              borderRadius: 16,
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#4A4A4A' }}>Sign Up</Text>
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 16 }}>
            <Text style={{ fontSize: 18, color: 'white', fontWeight: '600', fontFamily: 'Afacad' }}>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={{ fontSize: 18, fontWeight: '600', color: '#f95553', fontFamily: 'Afacad' }}> Log In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

