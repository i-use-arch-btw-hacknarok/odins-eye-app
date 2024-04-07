import { View, Text, StyleSheet} from "react-native";

export const ConferenceListItemContent = (props: ConferenceListItemContentProps) => {
    return (
        <View style={styles.container}>
            <View style={styles.dotWrapper}>
                <View style={[styles.dot, props.color ? {backgroundColor: props.color} : {}]}/>
            </View>
            <View>
                <Text style={styles.reasonText}>{ props.topic }</Text>
                <Text style={styles.countText}>{ props.date }</Text>
            </View>
        </View>
    )
}

export type ConferenceListItemContentProps = {
    topic: string;
    date: string;
    color?: string
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingVertical: 8,
        alignItems: 'center',
    },
    dotWrapper: {width: 36, height: 20, alignItems: 'center', justifyContent: 'center'},
    dot: {
        width: 12,
        height: 12,
        backgroundColor: '#FFC672',
        borderRadius: 12
    },
    reasonText: {fontSize: 16, color: '#000000'},
    countText: {fontSize: 13, color: '#52575f'},
})
