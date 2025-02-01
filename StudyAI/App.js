import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Animated, Easing } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from './components/HomeScreen';
import SettingsScreen from './components/SettingsScreen'; 

import { IntroductionRandomText, LoadingText } from './utils/texts';
import { LoadingMessageTime, OutAnimation } from './utils/animation';

const Stack = createStackNavigator();

export default function App() {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [moveFadeAnim] = useState(new Animated.Value(0));
  const [loadingAnim] = useState(new Animated.Value(0));
  const [currentText, setCurrentText] = useState(IntroductionRandomText());
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const [startPosition, setStartPosition] = useState(0);
  const most_recent_used = useRef(currentText);

  useEffect(() => {
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

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={LoginScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

});
