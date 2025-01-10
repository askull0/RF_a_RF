import { CameraView, useCameraPermissions } from 'expo-camera';
import {useRef, useState} from 'react';
import React, { forwardRef } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {AntDesign} from "@expo/vector-icons";
import CameraUse from "@/components/CameraUse";
import {router} from "expo-router";

export default function camera() {
    const [permission, requestPermission] = useCameraPermissions();
    const [photo, setPhoto] = useState<any>(null);
    const cameraRef = useRef<CameraView | null>(null);

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

    const handleTakePhoto = async () => {
        if(cameraRef.current) {
            const options = {
                quality: 1,
                base64: true,
                exif: false,
            };
            const takedPhoto = await cameraRef.current.takePictureAsync(options);

            setPhoto(takedPhoto);
        }
    };

    const handleRetakePhoto = () => setPhoto(null);

    const handleAddDetectedItems = (items: string[]) => {
        router.push({
            pathname: '/search',
            params: { detectedItems: items }
        });
    };

    if(photo) return <CameraUse photo={photo} handleRetakePhoto={handleRetakePhoto} onDetectedObjects={handleAddDetectedItems} />

    return (
        <View style={styles.container}>

            <CameraView style={styles.camera} ref={cameraRef} facing={"back"} mode={"picture"} ratio={'1:1'} testID="camera-view">
            </CameraView>

            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={handleTakePhoto} >
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
        //paddingBottom: 10,
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
