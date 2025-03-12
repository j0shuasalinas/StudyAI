import { View, Text, TouchableOpacity, Image, TextInput, Dimensions } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeftIcon } from 'react-native-heroicons/solid';
import { useNavigation } from '@react-navigation/native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';

const { width, height } = Dimensions.get('window');


export default function LoginScreen() {
  const navigation = useNavigation();
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const handleSubmit = async ()=> {
        if(email && password){
          try{
            await signInWithEmailAndPassword(auth, email, password);
          }catch(err){
            console.log('got error: ', err.message);
          }
        }
      }
  
  return (
    <View style={{ flex: 1, backgroundColor: '#5033cd' }}>
      <SafeAreaView style={{ flex: 1 }}>

        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Image source={require('../assets/logo.png')} style={{ width: 200, height: 200 }} />
        </View>


        <View style={{
          flex: 0,
          backgroundColor: '#fff',
          paddingHorizontal: 20,
          paddingTop: 20,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          top: width/15,
          borderWidth: 0,
          borderColor: '#464447',
        }}>
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontFamily: 'Afacad', fontSize: 18, color: '#4A4A4A', marginLeft: 10 }}>Email Address</Text>
            <TextInput
              style={{
                padding: 8,
                backgroundColor: '#F1F1F1',
                color: '#4A4A4A',
                borderRadius: 25,
                marginBottom: 5,
                fontFamily: 'Afacad', fontSize: 18,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: '#e1dded',
              }}
              placeholder="Enter Email Address"
              value={email}
              onChangeText={(value) => setEmail(value)}
            />

            <Text style={{ fontFamily: 'Afacad', fontSize: 18, color: '#4A4A4A', marginLeft: 10 }}>Password</Text>
            <TextInput
              style={{
                padding: 8,
                backgroundColor: '#F1F1F1',
                color: '#4A4A4A',
                borderRadius: 25,
                marginBottom: 15,
                fontFamily: 'Afacad', fontSize: 18,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: '#e1dded',
              }}
              placeholder="Enter Password"
              secureTextEntry
              value={password}
              onChangeText={(value) => setPassword(value)}
            />

            <TouchableOpacity style={{ alignItems: 'flex-end', marginBottom: 15 }}>
              <Text style={{ fontFamily: 'Afacad', color: '#4A4A4A' }}>Forgot Password</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleSubmit} style={{
              paddingVertical: 15,
              backgroundColor: '#493dba',
              borderRadius: 25,
              marginBottom: 0
            }}>
              <Text style={{
                fontSize: 18,
                fontWeight: 'bold',
                textAlign: 'center',
                color: '#fff',
                fontFamily: 'Afacad', fontSize: 18,
              }}>Login</Text>
            </TouchableOpacity>
          </View>

          <Text style={{
            fontSize: 18,
            color: '#4A4A4A',
            fontWeight: 'bold',
            textAlign: 'center',
            paddingVertical: 15,
            fontFamily: 'Afacad', fontSize: 18,
          }}>
            Or
          </Text>

          <View style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginBottom: 30
          }}>
            <TouchableOpacity
             style={{
              padding: 10,
              backgroundColor: '#F1F1F1',
              borderRadius: 25,
              marginHorizontal: 10
            }}>
              <Image source={require('../assets/icons/google.png')} style={{ width: 40, height: 40 }} />
            </TouchableOpacity>

            <TouchableOpacity style={{
              padding: 10,
              backgroundColor: '#F1F1F1',
              borderRadius: 25,
              marginHorizontal: 10
            }}>
              <Image source={require('../assets/icons/apple.png')} style={{ width: 40, height: 40 }} />
            </TouchableOpacity>

            <TouchableOpacity style={{
              padding: 10,
              backgroundColor: '#F1F1F1',
              borderRadius: 25,
              marginHorizontal: 10
            }}>
              <Image source={require('../assets/icons/facebook.png')} style={{ width: 40, height: 40 }} />
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
            <Text style={{ fontFamily: 'Afacad', color: 'gray', fontWeight: '500' }}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text style={{ fontFamily: 'Afacad', fontWeight: '700', color: '#493dba' }}> Sign Up</Text>
            </TouchableOpacity>
          </View>
          <Text style={{ fontFamily: 'Afacad', fontWeight: '700', color: '#F6A800', marginTop: 20 }}></Text>
        </View>
      </SafeAreaView>
    </View>
  );
}
