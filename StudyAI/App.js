import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Animated } from 'react-native';
import { IntroductionRandomText, LoadingText } from './utils/texts';
import { LoadingMessageTime } from './utils/animation';

export default function App() {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [currentText, setCurrentText] = useState(IntroductionRandomText());
  const most_recent_used = useRef(currentText);

  useEffect(() => {
    Animated.loop(
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
      ])
    ).start();

    const intervalId = setInterval(() => {
      const random_text = IntroductionRandomText();
      if (most_recent_used.current !== random_text) {
        most_recent_used.current = random_text;
        setCurrentText(random_text);
      }
    }, LoadingMessageTime("MessageChangeInterval"));

    return () => clearInterval(intervalId);
  }, [fadeAnim]);

  return (
    <View style={styles.container}>
      <Text>{LoadingText()}</Text>
      <Animated.Text style={{ opacity: fadeAnim, fontSize: 24 }}>
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
