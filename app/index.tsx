import {Text, View, StyleSheet, TouchableOpacity, ImageBackground} from "react-native";
import {useRouter} from "expo-router";

// @ts-ignore
import backgroundImage from '../assets/images/tlo01.png';
import {StatusBar} from "expo-status-bar";

export default function Index() {
    const router = useRouter();

    return (
        <>
        <StatusBar style="light" backgroundColor="transparent" translucent />
        <ImageBackground source={backgroundImage} style={styles.background}>
            <View style={styles.container}>
                <Text style={styles.welcomeText}>Welcome to the application!!</Text>
                <Text style={styles.middleText}>You can find recipes by taking a photo of the ingredients or simply by searching manually.</Text>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={() => router.push('/camera')}>
                        <Text style={styles.buttonText}>Take a Photo</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={() => router.push('/search')}>
                        <Text style={styles.buttonText}>Search Recipes</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ImageBackground>
        </>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover',  // cover entire screnn
    },
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        margin: 0,
    },
    welcomeText: {
        position: 'absolute',
        top: 60,
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#FFFFFF',
    },
    middleText: {
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center',
        marginHorizontal: 20,
        position: 'absolute',
        top: '26%',
        color: '#FFFFFF',
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 0,
        width: '96%',
        height: '40%',
        justifyContent: 'space-evenly',
        marginBottom: 10,
    },
    button: {
        // backgroundColor: 'rgba(129,94,65,0.9)',  // lekko brazowy
        // backgroundColor: 'rgba(59,72,106,0.9)',  //borowkowy
        backgroundColor: 'rgba(49,60,85,0.9)',  // borokowy ciemny
        borderRadius: 5,
        height: '45%',
        justifyContent: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
