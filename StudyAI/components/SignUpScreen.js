import { View, Text, TouchableOpacity, Image, TextInput, ScrollView } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeftIcon } from 'react-native-heroicons/solid';
import { useNavigation } from '@react-navigation/native';

export default function SignUpScreen() {
    const navigation = useNavigation();
    return (
        <View style={{ flex: 1, backgroundColor: '#A5A4FF' }}>
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={{
                            backgroundColor: '#F4A261',
                            padding: 10,
                            borderTopRightRadius: 20,
                            borderBottomLeftRadius: 20,
                            marginLeft: 16
                        }}>
                        <ArrowLeftIcon size="20" color="black" />
                    </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <Image source={require('../assets/logo.png')} style={{ width: 165, height: 110 }} />
                </View>
            </SafeAreaView>
            
            {/* This ScrollView ensures that content doesn't get cut off on smaller screens */}
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}>
                <View style={{ backgroundColor: 'white', paddingHorizontal: 32, paddingTop: 32, borderTopLeftRadius: 50, borderTopRightRadius: 50 }}>
                    <View style={{ marginBottom: 16 }}>
                        <Text style={{ color: '#4A4A4A', marginLeft: 8 }}>Full Name</Text>
                        <TextInput
                            style={{
                                padding: 16,
                                backgroundColor: '#F1F1F1',
                                color: '#4A4A4A',
                                borderRadius: 30,
                                marginBottom: 12
                            }}
                            placeholder="Enter Full Name"
                        />
                        <Text style={{ color: '#4A4A4A', marginLeft: 8 }}>Email Address</Text>
                        <TextInput
                            style={{
                                padding: 16,
                                backgroundColor: '#F1F1F1',
                                color: '#4A4A4A',
                                borderRadius: 30,
                                marginBottom: 12
                            }}
                            placeholder="Enter Email Address"
                        />
                        <Text style={{ color: '#4A4A4A', marginLeft: 8 }}>Password</Text>
                        <TextInput
                            style={{
                                padding: 16,
                                backgroundColor: '#F1F1F1',
                                color: '#4A4A4A',
                                borderRadius: 30,
                                marginBottom: 32
                            }}
                            placeholder="Enter Password"
                            secureTextEntry
                        />
                        <TouchableOpacity
                            style={{
                                backgroundColor: '#F4A261',
                                paddingVertical: 16,
                                borderRadius: 30
                            }}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'white', textAlign: 'center' }}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={{ fontSize: 18, color: '#4A4A4A', fontWeight: 'bold', textAlign: 'center', paddingVertical: 16 }}>
                        Or
                    </Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', space: 16 }}>
                        <TouchableOpacity style={{ padding: 12, backgroundColor: '#F1F1F1', borderRadius: 30 }}>
                            <Image source={require('../assets/icons/google.png')} style={{ width: 40, height: 40 }} />
                        </TouchableOpacity>
                        <TouchableOpacity style={{ padding: 12, backgroundColor: '#F1F1F1', borderRadius: 30 }}>
                            <Image source={require('../assets/icons/apple.png')} style={{ width: 40, height: 40 }} />
                        </TouchableOpacity>
                        <TouchableOpacity style={{ padding: 12, backgroundColor: '#F1F1F1', borderRadius: 30 }}>
                            <Image source={require('../assets/icons/facebook.png')} style={{ width: 40, height: 40 }} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10, marginBottom: 20 }}>
                        <Text style={{ color: 'gray', fontWeight: '500' }}>Already have an account?</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={{ fontWeight: '700', color: '#F6A800' }}> Login</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}
