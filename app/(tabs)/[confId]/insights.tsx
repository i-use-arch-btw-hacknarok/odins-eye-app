import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {Image} from 'expo-image'


export default function InsightsScreen() {
    return (
        <ScrollView>
            <View style={styles.container2}>
                <View style={styles.container}>
                    <View style={styles.row}>
                        <View style={styles.item}>
                            <Image
                                source={require('@/assets/images/photo_2024-04-07_04-36-20.jpg')}
                                contentFit="contain"
                                style={styles.image}
                            />
                            <Text style={styles.label}>Participants attention in time</Text>
                        </View>
                        <View style={styles.item}>
                            <Image
                                source={require('@/assets/images/photo_2024-04-07_05-03-23.jpg')}
                                contentFit="contain"
                                style={styles.image}
                            />
                            <Text style={styles.label}>Attention to frequency ratio</Text>
                        </View>
                        <View style={styles.item}>
                            <Text style={styles.timestamp}>0:00 - 1:34</Text>
                            <Text style={[styles.text, { color: '#1ccd2b' }]}>
                                Podczas dzisiejszej konferencji skupimy się na różnych aspektach tej tematyki.
                            </Text>
                            <Text style={styles.timestamp}>1:34 - 2:56</Text>
                            <Text style={[styles.text, { color: '#d5850b' }]}>
                                Omówimy metody zbierania danych z tłumów, w tym wykorzystanie kamer monitoringu, czujników
                                ruchu, czy nawet analizy danych z mediów społecznościowych.
                            </Text>
                            <Text style={styles.timestamp}>2:56 - 4:12</Text>
                            <Text style={[styles.text, { color: '#cd1c31' }]}>
                                Następnie przyjrzymy się technikom przetwarzania i analizy tych danych za pomocą algorytmów uczenia maszynowego,
                                takich jak algorytmy klasyfikacji czy grupowania.
                            </Text>
                            <Text style={styles.timestamp}>4:12 - 5:43</Text>
                            <Text style={[styles.text, { color: '#cd1c31' }]}>
                                Jednym z kluczowych tematów, które chcemy poruszyć, jest również etyka związana z
                                analizą behawioralną tłumu.
                            </Text>
                            <Text style={styles.timestamp}>5:43 - 7:12</Text>
                            <Text style={[styles.text, { color: '#d5850b' }]}>
                                Jak zapewnić prywatność jednostek w zbiorze danych? Jak
                                uniknąć potencjalnych nadużyć w stosowaniu tych technik?
                            </Text>
                            <Text style={styles.timestamp}>7:12 - 8:54</Text>
                            <Text style={[styles.text, { color: '#1ccd2b' }]}>
                                To ważne pytania, na które musimy znaleźć odpowiedzi, aby rozwijać tę dziedzinę w sposób odpowiedzialny i zgodny z
                                wartościami społecznymi.
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        alignSelf: 'stretch',
        flex: 1,
    },
    container2: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        padding: 16,
    },
    row: {
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        gap: 24,
    },
    item: {
        alignItems: 'center',
    },
    image: {
        width: 400,
        height: 200,
    },
    label: {
        fontWeight: 'bold',
        marginTop: 8,
    },
    text: {
        textAlign: 'left',
        width: '100%',
        marginBottom: 16,
    },
    timestamp: {
        textAlign: 'left',
        width: '100%',
    }
});
