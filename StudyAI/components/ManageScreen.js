import React, { useState, useEffect } from 'react';
import { View, Dimensions, Modal, FlatList, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, TextInput, Image, useColorScheme } from 'react-native';
import { CheckBox } from '@react-native-community/checkbox';


import profilePicture from '../assets/basic_pfp.jpg';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { Switch } from 'react-native-gesture-handler';

import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

import { auth, db } from '../config/firebase';
import { collection, getDocs } from 'firebase/firestore'; 
import { firestore } from '../config/firebase';
import { addAssignment, getAssignments } from '../config/firebase';

SplashScreen.preventAutoHideAsync();

const { width, height } = Dimensions.get('window');

var SECTIONS = [
    {
        header: "Create New",
        items: [
            { id: "createNew", label: "New Assignment", type: "New", icon: "moon", color: "#4A90E2" },
        ]
    },
    {
        header: "Manage Existing",
        items: []
    }
];

export default function ManageScreen() {
    const systemTheme = useColorScheme(); 
    const [form, setForm] = React.useState({
        darkMode: systemTheme === "dark",
        wifi: false,
        showCollaborators: true,
    });

    const isDarkMode = form.darkMode;

    const [sections, setSections] = useState(SECTIONS);
    const [searchText, setSearchText] = useState('');
    const [assignments, setAssignments] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentAssignment, setCurrentAssignment] = useState(null);

    const editAssignment = (ID) => {
        const assignmentToEdit = sections[1].items.find(item => item.ID === ID);
        if (assignmentToEdit) {
            setCurrentAssignment(assignmentToEdit);
            setModalVisible(true);
        }
    };

    const [isFetching, setIsFetching] = useState(false);

    const setup = async () => {
        if (isFetching) return;
        setIsFetching(true);

        const updatedAssignments = await getAssignments();

        setSections(prevSections => {
            const updatedSections = [...prevSections];
            updatedSections[1].items = updatedAssignments;
            return updatedSections;
        });

        setIsFetching(false);
    };

    React.useEffect(() => {
    setup();
    }, []);

    

    const itemTemplate = {
        ID: "",
        Title:'Assignment',
        Class:'',
        Priority:1,
        DueDate:'',
        TimeDue:'23:59',
        EstimatedTime:1,
        Completed:false,
        PrioritizeLate:false,
        Exam:false,
        Optional:false,
        color: "#4A90E2"
    }

    
    
    const createAssignment = () => {
        const newAssignment = { ...itemTemplate, ID: (Math.floor(Math.random() * 10000000)).toString() };
        setCurrentAssignment(newAssignment);
        setModalVisible(true);
    };
    
    const handleSaveAssignment = async () => {
        if (currentAssignment.Title &&
            currentAssignment.Class &&
            currentAssignment.DueDate &&
            currentAssignment.TimeDue &&
            currentAssignment.Priority &&
            (typeof currentAssignment.PrioritizeLate === 'boolean') &&
            (typeof currentAssignment.Completed === 'boolean') &&
            currentAssignment.EstimatedTime &&
            (typeof currentAssignment.Exam === 'boolean') &&
            (typeof currentAssignment.Optional === 'boolean')
        ) {
            const datePattern = /^\d{4}-\d{1,2}-\d{1,2}$/; // regex
            const timePattern = /^\d{1,2}:\d{2}$/;
    
            if (!datePattern.test(currentAssignment.DueDate)) {
                alert("Invalid Date format. Use YYYY-M-D (e.g., 2025-2-20).");
                return;
            }
    
            if (!timePattern.test(currentAssignment.TimeDue)) {
                alert("Invalid Time format. Use H:MM (e.g., 23:58).");
                return;
            }
    
            const estimatedTime = Number(currentAssignment.EstimatedTime);
    
            if (isNaN(estimatedTime)) {
                alert("Estimated time must be a valid number.");
                return;
            }
    
            const priority = Number(currentAssignment.Priority);
    
            if (isNaN(priority)) {
                alert("Priority must be a valid number.");
                return;
            } else if (priority < 1 || priority > 5) {
                alert("Priority must be a valid number 1 to 5.");
                return;
            }
    
            const [hour, minute] = currentAssignment.TimeDue.split(":").map(Number);
            if (hour > 23) {
                alert("Impossible Time. Please use military time format (e.g., 23:29).");
                return;
            }
    
            const [year, month, day] = currentAssignment.DueDate.split("-").map(Number);
            const dueDate = new Date(year, month - 1, day);
    
            if (
                isNaN(dueDate.getTime()) || 
                dueDate.getFullYear() !== year || 
                dueDate.getMonth() + 1 !== month || 
                dueDate.getDate() !== day
            ) {
                alert("Invalid Date. Date must not be impossible.");
                return;
            }
    
            const today = new Date();
            today.setHours(0, 0, 0, 0);
    
            const threeDaysAgo = new Date();
            threeDaysAgo.setDate(today.getDate() - 4);
    
            if (dueDate >= threeDaysAgo) {
                try {
                    
                    await addAssignment(currentAssignment);
    
                   
                    const updatedAssignments = await getAssignments();
    
                    
                    setSections(prevSections => {
                        const updatedSections = [...prevSections];
                        updatedSections[1].items = updatedAssignments;  
                        return updatedSections;
                    });
    
                    setModalVisible(false);
                } catch (error) {
                    console.error("Error saving assignment:", error);
                    alert("There was an error saving the assignment.");
                }
            } else {
                alert("Date cannot be more than 3 days before today.");
            }
        } else {
            alert("Please fill out all fields to create a new assignment.");
        }
    };
    
    useEffect(() => {
        if (modalVisible && !currentAssignment) {
            const newAssignment = { ...itemTemplate, ID: sections[1].items.length + 1 };
            setCurrentAssignment(newAssignment);
        }
    }, [modalVisible, currentAssignment, sections]);

    
    
    

    const searchStyle = {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        height: 25,
        width: width/1.25,
        backgroundColor: '#f2f2f2',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e1dded',
        marginBottom: 12,
        paddingHorizontal: 12,
    }

    const idFormat = "uniqueid=";

    return (
        <SafeAreaView style={[styles.container, isDarkMode && styles.darkContainer]}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.profile}>
                    <Text style={[styles.profileAddress, isDarkMode && styles.darkSubText]}>
                        Manage assignments here.
                    </Text>
                </View>
    
                {sections.map(({ header, items }) => (
                    <View style={styles.section} key={header}>
                        
                        {header === 'Manage Existing' &&
                            <View>
                                
                                <Text style={[styles.sectionHeader, isDarkMode && styles.darkSubText]}>{header}</Text>
    
                                <TextInput
                                    style={searchStyle}
                                    placeholder="Search"
                                    placeholderTextColor={isDarkMode ? "#aaa" : "#555"}
                                    value={searchText}  
                                    onChangeText={(text) => setSearchText(text)}
                                >
                                </TextInput>
                                <TouchableOpacity style={styles.filter} key={header} onPress={() => {}}>
                                    <FeatherIcon name="filter" color={isDarkMode ? "#fff" : "#0c0c0c"} size={20} />
                                </TouchableOpacity>
                                
                            </View>
                        }
                        {header === 'Create New' &&
                            <Text style={[styles.sectionHeader, isDarkMode && styles.darkSubText]}>{header}</Text>
                        }
                        {header === 'Create New' &&
                            items.map(({ id, label, type, icon, color }) => (
                                <TouchableOpacity key={icon} onPress={createAssignment}>
                                    <View style={[styles.row, isDarkMode && styles.darkRow]}>
                                        <View style={[styles.rowIcon, { backgroundColor: color }]}>
                                            <FeatherIcon name={icon} color="#fff" size={18} />
                                        </View>
                                        <Text style={[styles.rowLabel, isDarkMode && styles.darkText]}>{label}</Text>
                                        
                                        <View style={{ flex: 1 }} />
                                        {type === 'toggle' && (
                                            <Switch
                                                value={form[id]}
                                                onValueChange={value => setForm({ ...form, [id]: value })}
                                                trackColor={{ false: '#767577', true: '#4d25c4' }}
                                            />
                                        )}
                                        {type === 'Link' && (
                                            <FeatherIcon name="chevron-right" color={isDarkMode ? "#fff" : "#0c0c0c"} size={22} />
                                        )}
                                        {type === 'New' && (
                                            <FeatherIcon name="plus" color={isDarkMode ? "#fff" : "#0c0c0c"} size={22} />
                                        )}
                                    </View>
                                </TouchableOpacity>
                            ))}
                            {header === 'Manage Existing' && (
                                items?.map(({ ID, Title, color }) => (
                                    <TouchableOpacity key={ID} onPress={() => editAssignment(ID)}>
                                        <View style={[styles.row, isDarkMode && styles.darkRow]}>
                                            <View style={[styles.rowIcon, { backgroundColor: color }]} />
                                            <Text style={[styles.rowLabel, isDarkMode && styles.darkText]}>{Title}</Text>
                                            <Text style={[styles.modalId]}>{`  id:${ID}  `}</Text>
                                            <View style={{ flex: 1 }} />
                                            <FeatherIcon name="edit" color={isDarkMode ? "#fff" : "#0c0c0c"} size={18} />
                                        </View>
                                    </TouchableOpacity>
                                ))
                            )}
                            <Modal visible={modalVisible} transparent animationType="slide">
                                <View style={styles.modalContainer}>
                                    <View style={styles.modalContent}>
                                    <Text style={styles.modalTitle}>
                                    {sections[1]?.items?.some(item => item.ID === currentAssignment?.ID)
                                        ? "Edit Assignment"
                                        : "Create Assignment"}
                                    </Text>

                                        <Text style={styles.modalId}>{currentAssignment?.ID ? idFormat+currentAssignment?.ID : idFormat+currentAssignment?.ID}</Text>
                                        
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Title"
                                            value={currentAssignment?.Title}
                                            onChangeText={(text) => setCurrentAssignment(prev => ({ ...prev, Title: text }))}
                                        />
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Class"
                                            value={currentAssignment?.Class}
                                            onChangeText={(text) => setCurrentAssignment(prev => ({ ...prev, Class: text }))}
                                        />
                                         <TextInput
                                            style={styles.input}
                                            placeholder="Due Date"
                                            value={currentAssignment?.DueDate}
                                            onChangeText={(text) => setCurrentAssignment(prev => ({ ...prev, DueDate: text }))}
                                        />

                                        <TextInput
                                            style={styles.input}
                                            placeholder="Time Due"
                                            value={currentAssignment?.TimeDue}
                                            onChangeText={(text) => setCurrentAssignment(prev => ({ ...prev, TimeDue: text }))}
                                        />

                                        <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                                            <Text style={styles.checkTitle}>{"      Completed"}</Text>
                                            <Text style={styles.checkTitle}>{"|"}</Text>
                                            <Text style={styles.checkTitle}>{"Prioritize Late"}</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Switch
                                                style={styles.inputCheck}
                                                value={currentAssignment?.Completed}
                                                trackColor={{ false: '#767577', true: '#4d25c4' }}
                                                onValueChange={(text) => setCurrentAssignment(prev => ({ ...prev, Completed: text }))}
                                            />
                                            <Text style={styles.checkTitle}>{"          "}</Text>
                                            <Switch
                                                style={styles.inputCheck}
                                                value={currentAssignment?.PrioritizeLate}
                                                trackColor={{ false: '#767577', true: '#4d25c4' }}
                                                onValueChange={(text) => setCurrentAssignment(prev => ({ ...prev, PrioritizeLate: text }))}
                                            />
                                        </View>


                                        <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                                            <Text style={styles.checkTitle}>{"       Exam   "}</Text>
                                            <Text style={styles.checkTitle}>{"|"}</Text>
                                            <Text style={styles.checkTitle}>{"  Optional"}</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Switch
                                                style={styles.inputCheck}
                                                value={currentAssignment?.Exam}
                                                trackColor={{ false: '#767577', true: '#4d25c4' }}
                                                onValueChange={(text) => setCurrentAssignment(prev => ({ ...prev, Exam: text }))}
                                            />
                                            <Text style={styles.checkTitle}>{"          "}</Text>
                                            <Switch
                                                style={styles.inputCheck}
                                                value={currentAssignment?.Optional}
                                                trackColor={{ false: '#767577', true: '#4d25c4' }}
                                                onValueChange={(text) => setCurrentAssignment(prev => ({ ...prev, Optional: text }))}
                                            />
                                        </View>


                                        <TextInput
                                            style={styles.input}
                                            placeholder="Time to Complete in Hours"
                                            value={currentAssignment?.EstimatedTime}
                                            onChangeText={(text) => setCurrentAssignment(prev => ({ ...prev, EstimatedTime: text }))}
                                        />
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Assignment Priority (1-5)"
                                            value={currentAssignment?.Priority}
                                            onChangeText={(text) => setCurrentAssignment(prev => ({ ...prev, Priority: text }))}
                                        />

                                        

                                        <TouchableOpacity style={styles.saveButton} onPress={handleSaveAssignment}>
                                            <Text style={styles.saveButtonText}>Save</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                                            <Text style={styles.closeButtonText}>Cancel</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </Modal>
                            
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );

}

const styles = StyleSheet.create({
    
    container: {
        flex: 1,
        backgroundColor: "#fff",
        borderColor: '#e1dded',
    },
    darkContainer: {
        backgroundColor: "#17151c",
        borderColor: '#e1dded',
    },
    filter: {
        padding: 0,
        alignItems: 'right',
        justifyContent: 'right',
        top: -height/25,
        right: -width/1.22,
    },
    scrollContainer: {
        paddingVertical: 24,
    },
    profile: {
        padding: 0,
        alignItems: 'center',
    },
    profileName: {
        marginTop: 10,
        fontSize: 25,
        fontFamily: "Afacad",
        fontWeight: '600',
        color: '#414d63',
        textAlign: 'center',
    },
    darkText: {
        color: "#ffffff",
        fontFamily: "Afacad",
    },
    darkSubText: {
        color: "#aaaaaa",
        fontFamily: "Afacad",
    },
    profileAddress: {
        marginTop: 5,
        fontSize: 16,
        fontFamily: "Afacad",
        color: '#989898',
        textAlign: 'center',
    },
    profileAvatar: {
        width: 100,
        height: 100,
        borderRadius: 9999,
    },
    profileAvatarWrapper: {
        position: 'relative',
    },
    profileAction: {
        width: 20,
        height: 20,
        borderRadius: 9999,
        backgroundColor: "#007bff",
        position: 'absolute',
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    section: {
        paddingHorizontal: 24,
    },
    sectionHeader: {
        paddingVertical: 12,
        fontSize: 15,
        fontWeight: '600',
        fontFamily: "Afacad",
        color: "#9e9e9e",
        textTransform: 'uppercase',
        letterSpacing: 1.1,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        height: 50,
        backgroundColor: '#f2f2f2',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e1dded',
        marginBottom: 12,
        paddingHorizontal: 12,
    },
    darkRow: {
        backgroundColor: "#201e26",
        borderColor: '#464252',
    },
    rowLabel: {
        fontSize: 20,
        fontFamily: "Afacad",
        color: '#0c0c0c',
        
    },
    rowIcon: {
        width: 0,
        height: 0,
        borderRadius: 999,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    modalContainer: { 
        flex: 1, 
        justifyContent: "center", 
        alignItems: "center",
        
    },
    modalContent: { width: "80%", 
        padding: 20, 
        backgroundColor: "#fff", 
        alignItems:'center',
        borderRadius: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e1dded',
        
    },
    modalTitle: { 
        fontSize: 22, 
        fontWeight: "bold",
        fontFamily: "Afacad",
    },
    modalId: { 
        fontSize: 15,
        color: "#ccc",
        fontFamily: "Afacad",
    },
    input: { 
        borderWidth: 1, 
        borderColor: "#ccc", 
        padding: 10, 
        marginBottom: 10,
        width: width/1.5,
        borderRadius: 5,
        backgroundColor: '#f2f2f2',
        fontFamily: "Afacad",
        fontSize: 18, 
    },
    checkTitle: {
        marginRight: 10,
        fontFamily: "Afacad",
        fontSize: 18,
    },
    inputCheck: {
        marginBottom: 5,
        marginTop: 10,
        fontFamily: "Afacad",
        fontSize: 18,
    },
    saveButton: { 
        backgroundColor: "#493dba", 
        padding: 10, 
        borderRadius: 5, 
        width: width/2,
        alignItems: "center",
        fontFamily: "Afacad",
    },
    saveButtonText: { 
        fontSize: 18,
        color: "#fff", 
        fontWeight: "bold",
        fontFamily: "Afacad",
    },
    closeButton: { 
        marginTop: 10, 
        alignItems: "center",
    },
    closeButtonText: { 
        color: "#493dba",
        fontFamily: "Afacad",
        fontSize: 18,
    },
});
