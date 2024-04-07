import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import {Tabs, useRouter} from 'expo-router';
import {TouchableOpacity} from "react-native";

export const unstable_settings = {
    initialRouteName: 'index',
};

function TabBarIcon(props: {
    name: React.ComponentProps<typeof FontAwesome>['name'];
    color: string;
}) {
    return <FontAwesome size={28} style={{marginBottom: -3}} {...props} />;
}
const BackButton = () => {
    const router = useRouter()

    const goToConferences = () => {
        if (router.canGoBack()) router.back();
        else router.replace({pathname: '/(conferences)'});
    }

    return (
        <TouchableOpacity onPress={goToConferences}>
            <FontAwesome name={'chevron-left'} size={20} style={{ paddingLeft: 16, color: '#000' }}/>
        </TouchableOpacity>
    )
}


export default function TabsLayout() {

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: '#0452a8',
                tabBarInactiveTintColor: '#495665',
                tabBarStyle: { backgroundColor: '#f6f8f9' },
                headerStyle: { backgroundColor: '#f6f8f9' },
                headerShown: true,
                headerLeft: () => <BackButton/>
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Camera',
                    tabBarIcon: ({color}) => <TabBarIcon name="camera" color={color}/>,
                }}
            />
            <Tabs.Screen
                name="insights"
                options={{
                    title: 'Insights',
                    tabBarIcon: ({color}) => <TabBarIcon name="line-chart" color={color}/>,
                }}
            />
        </Tabs>
    );
}
