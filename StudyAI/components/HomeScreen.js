import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Image, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ManageScreen from './ManageScreen';
import SettingsScreen from './SettingsScreen';
import WelcomeScreen from './welcomeScreen';
const createCalendarData = (daysAhead = 7) => {
  const data = [];
  const today = new Date();
  for (let i = -3; i <= daysAhead; i++) {
    const newDate = new Date(today);
    newDate.setDate(today.getDate() + i);
    const formattedDate = `${newDate.getMonth() + 1}/${newDate.getDate()}`;
    data.push(formattedDate);
  }
  return data;
};

const Stack = createStackNavigator();

const data = createCalendarData(14);

const getCurrentDateIndex = () => {
  const today = new Date();
  const formattedToday = `${today.getMonth() + 1}/${today.getDate()}`;
  return data.findIndex(date => date === formattedToday);
};

const { width, height } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(getCurrentDateIndex());
  const [miniBoxesData, setMiniBoxesData] = useState([]);
  const [miniBoxesData2, setMiniBoxesData2] = useState([]);
  
  useEffect(() => {
    const miniData = [];
    const today = new Date();
    for (let i = 0; i <= 4; i++) {
      const newDate = new Date(today);
      newDate.setDate(today.getDate() + i); 
      const formattedDate = `${newDate.getMonth() + 1}/${newDate.getDate()}`;
      miniData.push(formattedDate);
    }
    setMiniBoxesData(miniData);

    const miniData2 = [];
    for (let i = 5; i <= 9; i++) {
      const newDate = new Date(today);
      newDate.setDate(today.getDate() + i); 
      const formattedDate = `${newDate.getMonth() + 1}/${newDate.getDate()}`;
      miniData2.push(formattedDate);
    }
    setMiniBoxesData2(miniData2);
  }, []);
  
  const handleScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / (width * 0.7 + 20));
  
    setCurrentIndex(index);
  
    if (index === 0) {
      setTimeout(() => {
        flatListRef.current.scrollToIndex({
          index: data.length - 2, 
          animated: true,
          viewPosition: 0.5,
        });
        setCurrentIndex(data.length - 2);
      }, 5);
    } else if (index === data.length - 1) {
      setTimeout(() => {
        flatListRef.current.scrollToIndex({
          index: 1, 
          animated: true,
          viewPosition: 0.5,
        });
        setCurrentIndex(1);
      }, 5);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      const currentIndex = getCurrentDateIndex();
      if (flatListRef.current && currentIndex !== -1) {
        flatListRef.current.scrollToIndex({
          index: currentIndex,
          animated: false, 
          viewPosition: 0.5,
        });
      }
    }, 10);
  }, []);
  
  const handleMiniBoxClick = (date) => {
    const index = data.findIndex(d => d === date);
    if (index !== -1) {
      flatListRef.current.scrollToIndex({
        index: index,
        animated: true,
        viewPosition: 0.5,
      });
      setCurrentIndex(index);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.mainBoxesContainer}>
        <FlatList
          ref={flatListRef}
          data={data}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, index) => index.toString()}
          initialScrollIndex={getCurrentDateIndex()}
          snapToInterval={width * 0.7 + 20}
          alignItems="center"
          snapToAlignment="center"
          decelerationRate="fast"
          /*onMomentumScrollEnd={handleScroll}*/
          getItemLayout={(data, index) => ({
            length: width * 0.7 + 20,
            offset: (width * 0.7 + 20) * index,
            index,
          })}
          renderItem={({ item, index }) => {
            const today = new Date();
            const formattedToday = `${today.getMonth() + 1}/${today.getDate()}`;
            const isCurrentDay = item === formattedToday;
            
            const [itemMonth, itemDay] = item.split('/').map(Number);
            const itemDate = new Date(today.getFullYear(), itemMonth - 1, itemDay);

            const isAfterCurrent = itemDate > today;

            return (
              <View style={[styles.box, isAfterCurrent && styles.afterCurrentBox, isCurrentDay && styles.currentDayBox].filter(Boolean)}>
                <Text style={[styles.text, isAfterCurrent && styles.afterCurrentText, isCurrentDay && styles.currentDayText].filter(Boolean)}>{item}</Text>
              </View>
            );
          }}
        />
      </View>

      <View style={styles.miniBoxesContainer}>
        <FlatList
          data={miniBoxesData}
          horizontal
          scrollEnabled={false}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item}
          renderItem={({ item }) => {
            const today = new Date();
            const formattedToday = `${today.getMonth() + 1}/${today.getDate()}`;

            const isCurrentDay = item === formattedToday;

            return (
              <TouchableOpacity
                style={[styles.miniBox, isCurrentDay && styles.currentDayBox]}
                onPress={() => handleMiniBoxClick(item)}
              >
                <Text style={styles.miniBoxText}>{item}</Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      <View style={styles.miniBoxesContainer2}>
        <FlatList
          data={miniBoxesData2}
          horizontal
          scrollEnabled={false}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item}
          renderItem={({ item }) => {
            const today = new Date();
            const formattedToday = `${today.getMonth() + 1}/${today.getDate()}`;

            const isCurrentDay = item === formattedToday;

            return (
              <TouchableOpacity
                style={[styles.miniBox, isCurrentDay && styles.currentDayBox]}
                onPress={() => handleMiniBoxClick(item)}
              >
                <Text style={styles.miniBoxText}>{item}</Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      <View style={styles.nextAssingment}>
        <Text style={styles.assignmentItem}>Next Assignment:</Text>
      </View>

      <View style={styles.topBar}>
        <View style={styles.navBar}>
          <TouchableOpacity onPress={() => navigation.navigate('Manage')}>
            <Text style={styles.navItem}>MANAGE</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
            <Text style={styles.navItem}>PROFILE</Text>
          </TouchableOpacity>
        </View>
      </View>

    </View>

  );
};

// <View style={styles.logoContainer}>
//    <Image source={require('../assets/logo.png')} style={styles.image} />
// </View>

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', },
  mainBoxesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: { fontSize: 24, marginBottom: 20, marginTop: -60, fontFamily: "Afacad", },
  input: { width: 200, height: 40, borderWidth: 5, borderColor: "#fff", marginBottom: 10, padding: 8 },
  intro: { 
    color: '#fff', 
    fontSize: 24, 
    fontFamily: "Afacad",  
    backgroundColor: "#4d25c4", 
    borderWidth: 2, 
    borderColor: '#7757d9', 
    borderRadius: 10,
    textAlign: 'center',
    width: 100,
  },
  image: { 
    width: 50, 
    height: 50, 
    borderRadius: 25,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: width,
    backgroundColor: "#4d4a5e",
    position: 'absolute',
    top: 0,
    paddingVertical: 30, 
    zIndex: 1000,
  },
  imageTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: width,
    position: 'absolute',
    top: 0,
    paddingVertical: 30, 
    zIndex: 1000,
  },

  nextAssingment: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'left',
    width: width,
    position: 'absolute',
    top: width/5,
    left: 65,
    paddingVertical: 30, 
    zIndex: 1000,
  },
  
  logoContainer: {
    top: 0,
    left: 0,
    margin: -10,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 30
  },
  navItem: {
    marginRight: 40,
    fontFamily: "Afacad",
    fontSize: 30,
    height: 30,
    color: "#9e9e9e",
    fontWeight: '600',
    paddingVertical: 0,
    textTransform: 'uppercase',
    letterSpacing: 1.1,
  },

  assignmentItem: {
    marginRight: 40,
    fontFamily: "Afacad",
    fontSize: 15,
    color: "#9e9e9e",
    fontWeight: '600',
    paddingVertical: 12,
    textTransform: 'uppercase',
    letterSpacing: 1.1,
  },

  profileImage: {
    top: -17,
    right: -78,
    fontFamily: "Afacad",
    fontSize: 25,
    color: "#a9a6bf",
    backgroundImage: "url('../assets/cog.png')",
    backgroundColor: "fff",
    backgroundSize: "cover",
    width: 50,
    height: 50
  },

  assignmentItem: {
    marginRight: 40,
    fontFamily: "Afacad",
    fontSize: 15,
    color: "#9e9e9e",
    fontWeight: '600',
    paddingVertical: 12,
    textTransform: 'uppercase',
    letterSpacing: 1.1,
  },
  introContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    width: width * 0.7,
    height: width * 0.7,
    backgroundColor: '#f2f2f2',
    borderWidth: 1,
    borderColor: '#e1dded',
    borderRadius: 15,
    marginHorizontal: 10,
    alignItems: 'center',
  },
  afterCurrentBox: {
    width: width * 0.7,
    height: width * 0.7,
    backgroundColor: '#f2f2f2',
    borderWidth: 1,
    borderColor: '#b8b5bd',
    borderRadius: 15,
    marginHorizontal: 10,
    alignItems: 'center',
  },
  currentDayBox: {
    borderWidth: 0,
    backgroundColor: '#aa9fe0',
    borderColor: '#1d03a3',
  },
  text: {
    width: width * 0.3,
    fontFamily: "Afacad",
    borderColor: '#41396b',
    fontSize: 30,
    textAlign: 'center',
    color: '#a9a6bf',
  },
  afterCurrentText: {
    width: width * 0.3,
    fontFamily: "Afacad",
    borderColor: '#41396b',
    fontSize: 30,
    textAlign: 'center',
    color: '#535157',
  },
  currentDayText: {
    width: width * 0.3,
    fontFamily: "Afacad",
    borderColor: '#661ceb',
    borderRadius: 0,
    borderWidth: 0,
    fontSize: 30,
    textAlign: 'center',
    color: '#333',
  },
  miniBoxesContainer: {
    flexDirection: 'row',
    marginTop: -100,
    marginBottom: 200,
    marginLeft: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniBoxesContainer2: {
    flexDirection: 'row',
    marginTop: -190,
    marginBottom: 150,
    marginLeft: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniBox: {
    width: width * 0.17,
    height: width * 0.17,
    backgroundColor: '#f2f2f2',
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e1dded',
  },
  miniBoxText: {
    fontSize: 20,
    fontFamily: "Afacad",
    color: '#000',
  },
});

export default HomeScreen;
