import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Animated, Easing } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

import MainScreen from './components/HomeScreen';
import SettingsScreen from './components/SettingsScreen'; 
import ManageScreen from './components/ManageScreen'; 
import Login from './components/LogInScreen';
import { IntroductionRandomText, LoadingText } from './utils/texts';
import { LoadingMessageTime, OutAnimation } from './utils/animation';
import SignUpScreen from './components/SignUpScreen';
import WelcomeScreen from './components/welcomeScreen';

import useAuth from './hooks/useAuth';
import LoginScreen from './components/LogInScreen';

const Stack = createStackNavigator();

export default function App() {
  const { user } = useAuth();

  const [fadeAnim] = useState(new Animated.Value(0));
  const [moveFadeAnim] = useState(new Animated.Value(0));
  const [loadingAnim] = useState(new Animated.Value(0));

  const [currentText, setCurrentText] = useState(IntroductionRandomText());
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const [startPosition, setStartPosition] = useState(0);
  const [fontLoaded, setFontLoaded] = useState(false);

  const most_recent_used = useRef(currentText);

  useEffect(() => {
    const loadFonts = async () => {
      try {
        await Font.loadAsync({
          Afacad: require('./assets/fonts/AfacadFlux-Medium.ttf'),
        });
        setFontLoaded(true);
      } catch (error) {
        console.log('Error loading fonts:', error);
      } finally {
        SplashScreen.hideAsync();
      }
    };

    loadFonts();

    const intervalId = setInterval(() => {
      const random_text = IntroductionRandomText();
      if (most_recent_used.current !== random_text) {
        most_recent_used.current = random_text;
        setAssetsLoaded(true);
        setCurrentText(random_text);

        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: LoadingMessageTime("FadeIn"),
          useNativeDriver: true,
        }).start();

        Animated.timing(moveFadeAnim, {
          toValue: OutAnimation("FadeOutPosition"),
          duration: OutAnimation("FadeOutTime"),
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }).start();

        Animated.timing(loadingAnim, {
          toValue: -OutAnimation("FadeOutPosition"),
          duration: OutAnimation("FadeOutTime"),
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }).start();
      }
    }, LoadingMessageTime("MessageChangeInterval"));
  
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: LoadingMessageTime("FadeIn"),
          useNativeDriver: true,
        }),
        Animated.delay(LoadingMessageTime("Delay")),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: LoadingMessageTime("FadeOut"),
          useNativeDriver: true,
        }),
      ]),
    );
  
    animation.start();
  
    return () => {
      clearInterval(intervalId);
      animation.stop();
    };
  }, []);

  useEffect(() => {
    if (!assetsLoaded) {
      const timeout = setTimeout(() => {
        setAssetsLoaded(true);
      }, 3000); 
  
      return () => clearTimeout(timeout);
    }
  }, [assetsLoaded]);

  if (!assetsLoaded) {
    return (
      <View style={styles.container}>
        <Animated.Text 
          style={{
            transform: [{ translateY: loadingAnim }],
            fontSize: 16, 
          }}
        >
          {LoadingText()}
        </Animated.Text>
        <Animated.Text 
          style={{ 
            opacity: fadeAnim, 
            transform: [{ translateY: moveFadeAnim }],
            fontSize: 24 
          }}
        >
          {currentText}
        </Animated.Text>
        <StatusBar style="auto" />
      </View>
    );
  }

  if (!fontLoaded) {
    return null;
  }

  if (user) {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen 
            name="Home" 
            component={MainScreen}
            options={{
              headerStyle: {backgroundColor: '#493dba',},
              headerTintColor: '#d0c1d9',
              headerBackTitleStyle: {
                fontFamily: 'Afacad',
                fontSize: 20,
                color: '#fff',
              },
              headerBackTitle: 'Back',
              title: <Text style={{ fontFamily: 'Afacad', fontSize: 25, color: '#fff' }}>Dashboard</Text> 
            }} 
          />
          <Stack.Screen 
            name="Manage" 
            component={ManageScreen} 
            options={{ 
              headerStyle: {backgroundColor: '#493dba',},
              headerTintColor: '#d0c1d9',
              headerBackTitleStyle: {
                fontFamily: 'Afacad',
                fontSize: 20,
                color: '#fff',
              },
              headerBackTitle: 'Back',
              title: <Text style={{ fontFamily: 'Afacad', fontSize: 25, color: '#fff' }}>Manage</Text> 
            }} 
          />
          <Stack.Screen   
            name="Settings" 
            component={SettingsScreen} 
            // initialParams={{ userdata }}
            options={{ 
              headerStyle: {backgroundColor: '#493dba',},
              headerTintColor: '#d0c1d9',
              headerBackTitleStyle: {
                fontFamily: 'Afacad',
                fontSize: 20,
                color: '#fff',
              },
              headerBackTitle: 'Back',
              title: <Text style={{ fontFamily: 'Afacad', fontSize: 25, color: '#fff' }}>Profile</Text> 
            }} 
          />
          </Stack.Navigator>
        <StatusBar style="auto" />
      </NavigationContainer>
    );
  } else {
    return (
      <NavigationContainer style={{backgroundColor: "#5033cd"}}>
        <Stack.Navigator initialRouteName="Welcome" >
          <Stack.Screen 
            name="Welcome" 
            component={WelcomeScreen} 
            options={{ 
              headerStyle: {backgroundColor: '#fff',},
              title: <Text style={{ fontFamily: 'Afacad', fontSize: 25 }}>Welcome</Text> 
            }} 
          />
          <Stack.Screen 
            name="SignUp" 
            component={SignUpScreen} 
            options={{ 
              title: <Text style={{ fontFamily: 'Afacad', fontSize: 25 }}>Sign Up</Text> 
            }} 
          />
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{ 
              title: <Text style={{ fontFamily: 'Afacad', fontSize: 25 }}>Login</Text> 
            }} 
          />
        </Stack.Navigator>
        <StatusBar style="auto" />
      </NavigationContainer>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navigationContainer: {
    flex: 1,
    backgroundColor: '#493dba',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
