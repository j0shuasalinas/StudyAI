import { View, Text, TouchableOpacity, Image, TextInput } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeftIcon } from 'react-native-heroicons/solid';
import { useNavigation } from '@react-navigation/native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';

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
    <View style={{ flex: 1, backgroundColor: '#A5A4FF' }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', marginTop: 10 }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              backgroundColor: '#F9D342',
              padding: 10,
              borderTopRightRadius: 20,
              borderBottomLeftRadius: 20,
              marginLeft: 20
            }}
          >
            <ArrowLeftIcon size="20" color="black" />
          </TouchableOpacity>
        </View>

        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Image source={require('../assets/logo.png')} style={{ width: 200, height: 200 }} />
        </View>

        <View style={{
          flex: 1,
          backgroundColor: 'white',
          paddingHorizontal: 20,
          paddingTop: 20,
          borderTopLeftRadius: 50,
          borderTopRightRadius: 50
        }}>
          <View style={{ marginBottom: 20 }}>
            <Text style={{ color: '#4A4A4A', marginLeft: 10 }}>Email Address</Text>
            <TextInput
              style={{
                padding: 15,
                backgroundColor: '#F1F1F1',
                color: '#4A4A4A',
                borderRadius: 25,
                marginBottom: 15
              }}
              placeholder="Enter Email Address"
              value={email}
              onChangeText={(value) => setEmail(value)}
            />

            <Text style={{ color: '#4A4A4A', marginLeft: 10 }}>Password</Text>
            <TextInput
              style={{
                padding: 15,
                backgroundColor: '#F1F1F1',
                color: '#4A4A4A',
                borderRadius: 25,
                marginBottom: 15
              }}
              placeholder="Enter Password"
              secureTextEntry
              value={password}
              onChangeText={(value) => setPassword(value)}
            />

            <TouchableOpacity style={{ alignItems: 'flex-end', marginBottom: 15 }}>
              <Text style={{ color: '#4A4A4A' }}>Forgot Password</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleSubmit} style={{
              paddingVertical: 15,
              backgroundColor: '#F9D342',
              borderRadius: 25,
              marginBottom: 20
            }}>
              <Text style={{
                fontSize: 18,
                fontWeight: 'bold',
                textAlign: 'center',
                color: '#4A4A4A'
              }}>Login</Text>
            </TouchableOpacity>
          </View>

          <Text style={{
            fontSize: 18,
            color: '#4A4A4A',
            fontWeight: 'bold',
            textAlign: 'center',
            paddingVertical: 15
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
            <Text style={{ color: 'gray', fontWeight: '500' }}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text style={{ fontWeight: '700', color: '#F6A800' }}> Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
