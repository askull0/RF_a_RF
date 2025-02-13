import { CameraView, useCameraPermissions } from 'expo-camera';
import {useRef, useState} from 'react';
import React from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {AntDesign} from "@expo/vector-icons";
import CameraUse from "@/components/CameraUse";
import {useRouter} from "expo-router";

export default function camera() {
    const [permission, requestPermission] = useCameraPermissions();
    const [picture, setPicture] = useState<any>(null);
    const cameraRef = useRef<CameraView | null>(null);
    const router = useRouter();

    if (!permission) {
        // Camera permissions are still loading.
        return <View />;
    }

    if (!permission.granted) {
        return (
            <View style={styles.containerPermission}>
                <Text style={styles.message}>We need your permission to show the camera</Text>
                <Button onPress={requestPermission} title="grant permission"/>
            </View>
        );
    }

    const handleCapturePicture = async () => {
        if (cameraRef.current) {
            setPicture(await cameraRef.current.takePictureAsync());
        }
    };

    const handleResetPicture = () => setPicture(null);

    const handleAddDetectedItems = (items: string[]) => {
        router.push({
            pathname: '/search',
            params: { detectedItems: items }
        });
    };

    if(picture) return <CameraUse picture={picture} handleResetPicture={handleResetPicture} onDetectedObjects={handleAddDetectedItems} />

    return (
        <View style={styles.container}>

            <CameraView style={styles.camera} ref={cameraRef} facing={"back"} mode={"picture"} ratio={'1:1'} testID="camera-view">
            </CameraView>

            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={handleCapturePicture} >
                    <AntDesign name='camera' size={60} color={'black'} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    containerPermission:{
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    message: {
        textAlign: 'center',
        margin: 10,
        fontSize: 25,
    },
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: "center",
        top: 30,
    },
    camera: {
        height: '80%',
        width: '90%',
    },
    buttonContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        margin: 20,
    },
});
