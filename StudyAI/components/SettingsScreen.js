import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image, useColorScheme } from 'react-native';
import profilePicture from '../assets/basic_pfp.jpg';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { Switch } from 'react-native-gesture-handler';

const SECTIONS = [
    {
        header: "Preferences",
        items: [
            { id: "darkMode", label: "Dark Mode", type: "toggle", icon: "moon", color: "#4A90E2" },
            { id: "wifi", label: "Wi-Fi", type: "toggle", icon: "wifi", color: "#50C878" },
            { id: "showCollaborators", label: "Show Collaborators", type: "toggle", icon: "users", color: "#FF8C00" },
        ]
    },
    {
        header: "Account",
        items: [
            { id: "profile", label: "Edit Profile", type: "Link", icon: "user", color: "#E91E63" },
            { id: "security", label: "Security", type: "Link", icon: "lock", color: "#9C27B0" },
        ]
    }
];

export default function SettingsScreen() {
    const systemTheme = useColorScheme(); 
    const [form, setForm] = React.useState({
        darkMode: systemTheme === "dark",
        wifi: false,
        showCollaborators: true,
    });

    const isDarkMode = form.darkMode;

    return (
        <SafeAreaView style={[styles.container, isDarkMode && styles.darkContainer]}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.profile}>
                    <TouchableOpacity onPress={() => {}}>
                        <View style={styles.profileAvatarWrapper}>
                            <Image source={profilePicture} style={styles.profileAvatar} />
                            <View style={styles.profileAction}>
                                <FeatherIcon name="edit-3" size={15} color="#fff"/>
                            </View>
                        </View>
                    </TouchableOpacity>

                    <Text style={[styles.profileName, isDarkMode && styles.darkText]}>John Doe</Text>
                    <Text style={[styles.profileAddress, isDarkMode && styles.darkSubText]}>
                        123 Maple Street, Anytown, PA, 24124
                    </Text>
                </View>

                {SECTIONS.map(({ header, items }) => (
                    <View style={styles.section} key={header}>
                        <Text style={[styles.sectionHeader, isDarkMode && styles.darkSubText]}>{header}</Text>

                        {items.map(({ id, label, type, icon, color }) => (
                            <TouchableOpacity key={icon} onPress={() => {}}>
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
                                        />
                                    )}

                                    {type === 'Link' && (
                                        <FeatherIcon name="chevron-right" color={isDarkMode ? "#fff" : "#0c0c0c"} size={22} />
                                    )}
                                </View>
                            </TouchableOpacity>
                        ))}
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
    },
    darkContainer: {
        backgroundColor: "#121212",
    },
    scrollContainer: {
        paddingVertical: 24,
    },
    profile: {
        padding: 24,
        alignItems: 'center',
    },
    profileName: {
        marginTop: 20,
        fontSize: 19,
        fontWeight: '600',
        color: '#414d63',
        textAlign: 'center',
    },
    darkText: {
        color: "#ffffff",
    },
    darkSubText: {
        color: "#aaaaaa",
    },
    profileAddress: {
        marginTop: 5,
        fontSize: 16,
        color: '#989898',
        textAlign: 'center',
    },
    profileAvatar: {
        width: 72,
        height: 72,
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
        right: -4,
        bottom: -10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    section: {
        paddingHorizontal: 24,
    },
    sectionHeader: {
        paddingVertical: 12,
        fontSize: 12,
        fontWeight: '600',
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
        marginBottom: 12,
        paddingHorizontal: 12,
    },
    darkRow: {
        backgroundColor: "#1E1E1E",
    },
    rowLabel: {
        fontSize: 17,
        color: '#0c0c0c',
    },
    rowIcon: {
        width: 32,
        height: 32,
        borderRadius: 999,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
});
