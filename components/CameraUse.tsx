import { Fontisto } from '@expo/vector-icons';
import { CameraCapturedPicture } from 'expo-camera';
import React from 'react';
import { TouchableOpacity, SafeAreaView, Image, StyleSheet, View, Alert } from 'react-native';

const CameraUse = ({
                       photo,
                       handleRetakePhoto,
                       onDetectedObjects
                   }: {
    photo: CameraCapturedPicture;
    handleRetakePhoto: () => void;
    onDetectedObjects: (objects: string[]) => void;
}) => {

    const sendPhoto = async () => {
        try {
            const formData = new FormData();
            formData.append("image", {
                uri: photo.uri,
                type: "image/jpg",
                name: "photo.jpg"
            } as any);

            const response = await fetch('http://192.168.1.49:5000/detect', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.json();
            console.log(data.predictions);
            onDetectedObjects(data.predictions); // objects to parent

        } catch (error) {
            console.error("Error sending photo:", error);
            Alert.alert("Error", "Failed to send the photo.");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.box}>
                <Image
                    style={styles.previewContainer}
                    source={{ uri: 'data:image/jpg;base64,' + photo.base64 }} />
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={handleRetakePhoto}>
                    <Fontisto name='redo' size={36} color='black' />
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={sendPhoto}>
                    <Fontisto name='check' size={36} color='black' />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    box: {
        borderRadius: 15,
        padding: 1,
        width: '95%',
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: "center",
    },
    previewContainer: {
        width: '95%',
        height: '90%',
        borderRadius: 15
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: "space-around",
        width: '100%',
    },
    button: {
        backgroundColor: 'transparent',
        borderRadius: 25,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
    }
});

export default CameraUse;
