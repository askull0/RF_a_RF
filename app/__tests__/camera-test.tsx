import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import Camera from '../camera';
import { useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';

jest.mock('expo-camera', () => ({
    CameraView: jest.fn().mockImplementation(({ children }) => <>{children}</>),
    useCameraPermissions: jest.fn(),
}));

jest.mock('expo-router', () => ({
    router: {
        push: jest.fn(),
    },
}));

describe('Camera Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('wyświetla pusty ekran podczas ładowania uprawnień', () => {
        (useCameraPermissions as jest.Mock).mockReturnValue([null, jest.fn()]);
        const { toJSON } = render(<Camera />);
        expect(toJSON()).toMatchSnapshot();
    });

    it('wyświetla komunikat o braku uprawnień i przycisk ich żądania', () => {
        const mockRequestPermission = jest.fn();
        (useCameraPermissions as jest.Mock).mockReturnValue([
            { granted: false },
            mockRequestPermission,
        ]);

        const { getByText } = render(<Camera />);
        expect(getByText('We need your permission to show the camera')).toBeTruthy();
        const grantButton = getByText('grant permission');
        fireEvent.press(grantButton);
        expect(mockRequestPermission).toHaveBeenCalled();
    });
});

describe('handleAddDetectedItems', () => {
    it('should call router.push with correct parameters', () => {
        const mockItems = ['item1', 'item2'];
        const spyRouterPush = jest.spyOn(router, 'push');

        const handleAddDetectedItems = (items: string[]) => {
            router.push({
                pathname: '/search',
                params: { detectedItems: items },
            });
        };
        handleAddDetectedItems(mockItems);

        expect(spyRouterPush).toHaveBeenCalledWith({
            pathname: '/search',
            params: { detectedItems: mockItems },
        });
    });
});

describe('handleRetakePhoto', () => {
    it('should reset the photo state', () => {
        let photo = { uri: 'some-uri' };
        const setPhoto = jest.fn((newPhoto) => (photo = newPhoto));

        const handleRetakePhoto = () => setPhoto(null);

        handleRetakePhoto();

        expect(setPhoto).toHaveBeenCalledWith(null);
        expect(photo).toBe(null);
    });
});

describe('handleTakePhoto', () => {
    it('should call takePictureAsync and update photo state', async () => {
        const mockCameraRef = {
            current: {
                takePictureAsync: jest.fn().mockResolvedValue({
                    uri: 'file://path/to/photo.jpg',
                    base64: 'base64string',
                }),
            },
        };
        let photo = null;
        const setPhoto = jest.fn((newPhoto) => (photo = newPhoto));

        const handleTakePhoto = async () => {
            if (mockCameraRef.current) {
                const takedPhoto = await mockCameraRef.current.takePictureAsync();
                setPhoto(takedPhoto);
            }
        };
        await handleTakePhoto();

        expect(mockCameraRef.current.takePictureAsync).toHaveBeenCalled();
        expect(setPhoto).toHaveBeenCalledWith({
            uri: 'file://path/to/photo.jpg',
            base64: 'base64string',
        });
        expect(photo).toEqual({
            uri: 'file://path/to/photo.jpg',
            base64: 'base64string',
        });
    });
});

