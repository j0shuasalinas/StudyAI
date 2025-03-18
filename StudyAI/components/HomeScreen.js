import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Image, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ManageScreen from './ManageScreen';
import SettingsScreen from './SettingsScreen';
import WelcomeScreen from './welcomeScreen';
import { getAssignments } from '../config/firebase';
import { collection } from 'firebase/firestore';
import FeatherIcon from 'react-native-vector-icons/Feather';

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

  const [assignmentText, setAssignmentText] = useState({});
  const [bestAssignment, setBestAssignments] = useState(null);

  useEffect(() => {
    const fetchAllAssignments = async () => {
      const assignments = await getAssignments();
      const today = new Date();
      //today.setUTCHours(); // Normalize today's date
  
      const assignmentsByDate = {};
  
      // Sort assignments by custom rules
      assignments.sort((a, b) => {
        const aDueDate = new Date(a.DueDate["seconds"] * 1000);
        const bDueDate = new Date(b.DueDate["seconds"] * 1000);
  
        // Prioritize past-due assignments
        const aIsPastDue = aDueDate < today;
        const bIsPastDue = bDueDate < today;
        if (aIsPastDue !== bIsPastDue) {
          return aIsPastDue ? -1 : 1; // Past-due assignments come first
        }
  
        // Prioritize exams (unless past due)
        if (!aIsPastDue && !bIsPastDue) {
          if (a.Exam && !b.Exam) return -1;
          if (!a.Exam && b.Exam) return 1;
        }
  
        // Sort by priority (higher priority first)
        if (a.Priority !== b.Priority) {
          return b.Priority - a.Priority;
        }
  
        // Sort by due time (earlier times first)
        const aTime = a.TimeDue || "23:59"; // Default to latest time if not provided
        const bTime = b.TimeDue || "23:59";
        return aTime.localeCompare(bTime);
      });
  
      for (const assignment of assignments) {
        const dueDate = new Date(assignment.DueDate["seconds"] * 1000);
        dueDate.setUTCHours(0, 0, 0, 0); // Normalize due date for comparison
  
        let formattedDate;
        if (dueDate < today) {
          // If the assignment is past due, group it under "Past Due"
          formattedDate = "Past Due";
        } else {
          // Otherwise, group it by its due date
          formattedDate = `${dueDate.getMonth() + 1}/${dueDate.getDate()}`;
        }
  
        if (!assignmentsByDate[formattedDate]) {
          assignmentsByDate[formattedDate] = "Due:";
        }
  
        // Limit to 3 assignments per date
        const currentAssignments = assignmentsByDate[formattedDate].split("\n").slice(1);
        if (currentAssignments.length < 3) {
          let assignmentText = assignment.Title;
  
          // Add (o) for optional assignments
          if (assignment.Optional) {
            assignmentText += " (o)";
          }
  
          // Add due time if available
          if (assignment.TimeDue) {
            assignmentText += ` [${assignment.TimeDue}]`;
          }
  
          assignmentsByDate[formattedDate] += `\n${assignmentText}`;
        } else if (currentAssignments.length === 3) {
          assignmentsByDate[formattedDate] += `\n...`;
        }
      }
  
      // Check if today has no assignments
      const formattedToday = `${today.getMonth() + 1}/${today.getDate()}`;
      if (!assignmentsByDate[formattedToday]) {
        // Recommend assignments for today
        const recommendations = assignments
          .filter((assignment) => {
            const dueDate = new Date(assignment.DueDate["seconds"] * 1000);
            dueDate.setUTCHours(0, 0, 0, 0);
            return dueDate >= today && !assignment.Optional; // Only recommend non-optional assignments
          })
          .sort((a, b) => {
            // Sort by priority, then Exam, then EstimatedTime
            if (a.Priority !== b.Priority) {
              return b.Priority - a.Priority;
            }
            if (a.Exam !== b.Exam) {
              return b.Exam ? 1 : -1; // Exams come first
            }
            return (b.EstimatedTime || 0) - (a.EstimatedTime || 0); // Longer EstimatedTime comes first
          })
          .slice(0, 3); // Limit to 3 recommendations
  
        if (recommendations.length > 0) {
          assignmentsByDate[formattedToday] = "Recommended:";
          for (const recommendation of recommendations) {
            let assignmentText = recommendation.Title;
  
            if (recommendation.Optional) {
              assignmentText += " (o)";
            }
  
            if (recommendation.DueDate) {
              const dueDate = new Date(recommendation.DueDate["seconds"] * 1000);
              assignmentText += ` [${dueDate.getMonth()+1}/${dueDate.getDate()}]`;
            }
  
            assignmentsByDate[formattedToday] += `\n${assignmentText}`;
          }
        }
      }
  
      setAssignmentText(assignmentsByDate);
    };
  
    fetchAllAssignments();
  }, []);

  useEffect(() => {
    const fetchAssignmentsAndGetBest = async () => {
      const assignments = await getAssignments(); // Fetch assignments
  
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);
  
      const validAssignments = assignments.filter((assignment) => {
        const dueDate = new Date(assignment.DueDate["seconds"] * 1000);
        dueDate.setUTCHours(0, 0, 0, 0);
        return dueDate >= today && !assignment.Optional;
      });
  
      if (validAssignments.length === 0) {
        setBestAssignments(null);
        return;
      }
  
      validAssignments.sort((a, b) => {
        const aDueDate = new Date(a.DueDate["seconds"] * 1000);
        const bDueDate = new Date(b.DueDate["seconds"] * 1000);
  
        if (aDueDate.getTime() !== bDueDate.getTime()) {
          return aDueDate.getTime() - bDueDate.getTime();
        }
  
        if (a.Priority !== b.Priority) {
          return b.Priority - a.Priority;
        }
  
        if (a.Exam !== b.Exam) {
          return b.Exam ? 1 : -1;
        }
  
        return (b.EstimatedTime || 0) - (a.EstimatedTime || 0);
      });
  
      const bestDueDate = new Date(validAssignments[0].DueDate["seconds"] * 1000);
      setBestAssignments(`${validAssignments[0].Title} [${bestDueDate.getMonth()+1}/${bestDueDate.getDate()}]`);
    };
  
    fetchAssignmentsAndGetBest();
  }, []); // Add dependencies if needed

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
          renderItem={({ item }) => {
            const today = new Date();
            const formattedToday = `${today.getMonth() + 1}/${today.getDate()}`;
            const isCurrentDay = item === formattedToday;
    
            const [itemMonth, itemDay] = item.split("/").map(Number);
            const itemDate = new Date(today.getFullYear(), itemMonth - 1, itemDay);
    
            const isAfterCurrent = itemDate > today;
            const formatted = `${itemMonth}/${itemDay}`;
            const text = assignmentText[formatted]||"empty!";

            // console.log(assignmentText);
            
            const pastDueText = itemDate===today ? assignmentText["PastDue"] : "";

            return (
              <View style={[styles.box, isAfterCurrent && styles.afterCurrentBox, isCurrentDay && styles.currentDayBox].filter(Boolean)}>
                <Text style={[styles.text, isAfterCurrent && styles.afterCurrentText, isCurrentDay && styles.currentDayText].filter(Boolean)}>{item}</Text>
                <Text style={[styles.textdue, isAfterCurrent && styles.afterCurrentTextDue, isCurrentDay && styles.currentDayTextDue].filter(Boolean)}>{text}</Text>
                <Text style={styles.pastduetext}>{pastDueText}</Text>
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

            const hasAssignment = !(assignmentText[item]===undefined);

            return (
              <TouchableOpacity
                style={[styles.miniBox, isCurrentDay && styles.currentDayBox]}
                onPress={() => handleMiniBoxClick(item)}
              >
                <Text style={styles.miniBoxText}>{item}</Text>
                {hasAssignment && (
                  <View style={styles.iconContainer}>
                    <FeatherIcon name="clock" color="#e65f17" size={20} />
                  </View>
                )}
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

            const hasAssignment = !(assignmentText[item]===undefined);

            return (
              <TouchableOpacity
                style={[styles.miniBox, isCurrentDay && styles.currentDayBox]}
                onPress={() => handleMiniBoxClick(item)}
              >
                <Text style={styles.miniBoxText}>{item}</Text>
                {hasAssignment && (
                  <View style={styles.iconContainer}>
                    <FeatherIcon name="clock" color="#e65f17" size={20} />
                  </View>
                )}
              </TouchableOpacity>
            );
          }}
        />
      </View>

      <View style={styles.nextAssingment}>
        <Text style={styles.assignmentItem}>{"Next Assignment: "+bestAssignment}</Text>
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
    backgroundColor: "#f2f2f2",
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
  hasAssignment: {
    top: -10
  },
  currentDayBox: {
    borderWidth: 0,
    backgroundColor: '#493dba',
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
  textdue: {
    width: width * 0.7,
    fontFamily: "Afacad",
    borderColor: '#41396b',
    fontSize: 20,
    textAlign: 'center',
    color: '#a9a6bf',
  },
  pastduetext: {
    width: width * 0.3,
    fontFamily: "Afacad",
    borderColor: '#41396b',
    fontSize: 20,
    textAlign: 'center',
    color: '#e84858',
  },
  afterCurrentText: {
    width: width * 0.3,
    fontFamily: "Afacad",
    borderColor: '#41396b',
    fontSize: 30,
    textAlign: 'center',
    color: '#535157',
  },
  afterCurrentTextDue: {
    width: width * 0.7,
    fontFamily: "Afacad",
    borderColor: '#41396b',
    fontSize: 20,
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
    color: '#fff',
  },
  currentDayTextDue: {
    width: width * 0.7,
    fontFamily: "Afacad",
    borderColor: '#661ceb',
    borderRadius: 0,
    borderWidth: 0,
    fontSize: 20,
    textAlign: 'center',
    color: '#fff',
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
    position: 'relative', 
    alignItems: 'center',
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
  iconContainer: {
    position: 'absolute',
    top: 0, 
    right: 0
  }
});

export default HomeScreen;
