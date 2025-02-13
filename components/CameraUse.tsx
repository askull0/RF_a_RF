import {Entypo, MaterialCommunityIcons} from '@expo/vector-icons';
import { CameraCapturedPicture } from 'expo-camera';
import React from 'react';
import { TouchableOpacity, Image, StyleSheet, View, Alert } from 'react-native';

type CameraUseProps = {
    picture: CameraCapturedPicture;
    handleResetPicture: () => void;
    onDetectedObjects: (objects: string[]) => void;
};

const CameraUse = (props: CameraUseProps) => {
    const { picture, handleResetPicture, onDetectedObjects } = props;

    const sendPicture = async () => {
        try {
            const formData = new FormData();
            formData.append("image", {
                uri: picture.uri,
                type: "image/jpg",
                name: "picture.jpg"
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
            onDetectedObjects(data.predictions);

        } catch (error) {
            console.error("Error sending picture:", error);
            Alert.alert("Error", "Failed to send the picture.");
        }
    };

    return (
        <View style={styles.container}>
            <Image
                testID="picture-image"
                style={styles.cameraUseContainer}
                source={{ uri: picture.uri }} />

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={handleResetPicture} testID="retake-button">
                   <MaterialCommunityIcons name='reload' size={38} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={sendPicture} testID="send-picture-button">
                    <Entypo name='check' size={38} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cameraUseContainer: {
        width: '90%',
        height: '85%',
        borderRadius: 18
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: "space-around",
        width: '100%',
    },
    button: {
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        padding: 12,
    }
});

export default CameraUse;
