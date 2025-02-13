import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import Camera from '../camera';
import {useRouter} from "expo-router";

jest.mock('expo-camera', () => ({
    CameraView: 'CameraView',
    useCameraPermissions: jest.fn(),
}));

jest.mock('expo-router', () => ({
    useRouter: jest.fn(),
}));

describe('Camera ', () => {

    it('shows blank screen during loading permissions', () => {
        const { useCameraPermissions } = require('expo-camera');
        useCameraPermissions.mockReturnValue([null]);

        render(<Camera />);
        expect(screen.toJSON()).toMatchSnapshot();
    });

    it('display message about the lack of permissions and a button to request them', () => {
        const mockRequestPermission = jest.fn();
        const { useCameraPermissions } = require('expo-camera');
        useCameraPermissions.mockReturnValue([{ granted: false }, mockRequestPermission,]);

        render(<Camera />);
        expect(screen.getByText('We need your permission to show the camera')).toBeTruthy();

        fireEvent.press(screen.getByText('grant permission'));
        expect(mockRequestPermission).toHaveBeenCalled();
    });
});

describe('handleAddDetectedItems', () => {
    it('should push to search with correct parameters', () => {
        const mockItems = ['item1', 'item2'];
        const mockPush = jest.fn();
        const { useRouter } = require('expo-router');
        useRouter.mockReturnValue({ push: mockPush });
        const router = useRouter();

        const handleAddDetectedItems = (items: string[]) => {
            router.push({
                pathname: '/search',
                params: { detectedItems: items },
            });
        };
        handleAddDetectedItems(mockItems);

        expect(mockPush).toHaveBeenCalledWith({
            pathname: '/search',
            params: { detectedItems: mockItems },
        });
    });
});

describe('handleResetPicture', () => {
    it('should reset the picture state', () => {
        let picture = { uri: 'some-uri' };
        const setPicture = jest.fn((newPicture) => (picture = newPicture));

        const handleResetPicture = () => setPicture(null);

        handleResetPicture();

        expect(setPicture).toHaveBeenCalledWith(null);
        expect(picture).toBe(null);
    });
});

describe('handleCapturePicture', () => {
    it('should call takePictureAsync and update picture state', async () => {
        const mockCameraRef = {
            current: {
                takePictureAsync: jest.fn().mockResolvedValue({
                    uri: 'file://picture.jpg',
                }),
            },
        };
        let picture = null;
        const setPicture = jest.fn((newPicture) => (picture = newPicture));

        const handleCapturePicture = async () => {
            if (mockCameraRef.current) {
                const takedPicture = await mockCameraRef.current.takePictureAsync();
                setPicture(takedPicture);
            }
        };
        await handleCapturePicture();

        expect(mockCameraRef.current.takePictureAsync).toHaveBeenCalled();
        expect(setPicture).toHaveBeenCalledWith({uri: 'file://picture.jpg',});
        expect(picture).toEqual({uri: 'file://picture.jpg',});
    });
});

