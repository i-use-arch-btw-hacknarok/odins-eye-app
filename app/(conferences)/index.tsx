import React, {useEffect} from "react";
import {FlatList, SafeAreaView, StyleSheet, Text, View} from "react-native";
import {getConferences, GetConferencesResponse} from "@/services/api/get-conferences";
import {Colors} from "@/constants/Colors";
import {ConferenceListItem} from "@/components/ConferenceListtem";
import { useRouter } from "expo-router";

export default function ConferencesScreen() {
    const [conferences, setConference] = React.useState<GetConferencesResponse[]>([]);
    const router = useRouter();

    useEffect(() => {
        getConferences()
            .then(({data}) => setConference(data.slice(0, 10)))
            .catch(console.error);
    }, []);

    const goToConference = (confId: string) => {
        router.push({pathname: '/(tabs)/[confId]/', params: {confId}});
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <FlatList
                    style={styles.flatList}
                    data={conferences}
                    renderItem={(data) => <ConferenceListItem key={data.index} conference={data.item} onPress={() => goToConference(data.item.id)}/>}/>
            </View>
        </SafeAreaView>
    );
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        position: 'relative',
        backgroundColor: '#f6f8f9',
    },
    flatList: {
        padding: 16
    }
});
