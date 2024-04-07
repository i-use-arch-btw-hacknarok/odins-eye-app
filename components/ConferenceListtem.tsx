import {GetConferencesResponse} from "@/services/api/get-conferences";
import {StyleSheet, TouchableOpacity, View} from "react-native";
import React from "react";
import {ConferenceListItemContent} from "@/components/ConferenceListItemContent";

export interface ConferenceListItemProps {
    conference: GetConferencesResponse,
    onPress: () => void,
};

export const ConferenceListItem = (props: ConferenceListItemProps) => {
    const {conference, onPress} = props;

    return (
        <TouchableOpacity onPress={onPress}>
            <View style={styles.shadow1}>
                <View style={styles.shadow2}>
                    <View style={styles.container}>
                        <ConferenceListItemContent topic={conference.topic} date={conference.createdAt}
                                                   color={conference.videoId ? '#1ccd2b' : '#ffc672'}/>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}


const styles = StyleSheet.create({
    shadow1: {
        borderRadius: 18,
        backgroundColor: '#fff',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 23.68,
        },
        shadowOpacity: 0.04,
        shadowRadius: 47.36,
        marginBottom: 16,
    },
    shadow2: {
        borderRadius: 18,
        backgroundColor: '#fff',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.04,
        shadowRadius: 11.84,
    },
    container: {
        borderRadius: 18,
        backgroundColor: 'white',
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
});
