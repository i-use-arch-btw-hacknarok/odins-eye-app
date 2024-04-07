import React from 'react';
import {Stack, Tabs} from 'expo-router';
import {Colors} from "@/constants/Colors";



export default function ConferencesLayout() {
    return (
        <Stack screenOptions={{
            headerStyle: { backgroundColor: '#f6f8f9' },
            headerShown: true
        }}>
            <Stack.Screen name="index" options={{ title: "Conferences"}}/>
        </Stack>
    );
}
