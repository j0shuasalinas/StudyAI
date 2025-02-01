import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Animated, Easing } from 'react-native';
import { IntroductionRandomText, LoadingText } from './utils/texts';
import { LoadingMessageTime, OutAnimation } from './utils/animation';

import Onboarding from './main'; 

export default function App() {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [moveFadeAnim] = useState(new Animated.Value(0));
  const [loadingAnim] = useState(new Animated.Value(0));
  const [currentText, setCurrentText] = useState(IntroductionRandomText());
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const [startPosition, setStartPosition] = useState(0);
  const most_recent_used = useRef(currentText);

  const handleLayout = (event) => {
    const { y } = event.nativeEvent.layout;
    setStartPosition(y); 
    moveFadeAnim.setValue(y); 
  };

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
    if (assetsLoaded) {
      console.log("Assets loaded");
    }
  }, [assetsLoaded]);

  useEffect(() => {
    if (!assetsLoaded) {
      const timeout = setTimeout(() => {
        setAssetsLoaded(true);
      }, 3000); 
  
      return () => clearTimeout(timeout);
    }
  }, [assetsLoaded]);
  

  if (assetsLoaded) {
    setTimeout(() => {
      return <Onboarding />;
    }, OutAnimation("FadeOutTime"));
  }

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
