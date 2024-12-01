import React from 'react';
import {ActivityIndicator, StyleSheet, Text} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const LoadingIcon = () => (
    <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
            <ActivityIndicator size="large" color='white' />
            <Text style={styles.loadingText}>Searching...</Text>
        </SafeAreaView>
    </SafeAreaProvider>

);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
    },
    loadingText: {
        color: 'white',
        marginTop: 10,
        fontSize: 18,
    },
});

export default LoadingIcon;