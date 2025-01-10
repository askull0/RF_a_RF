import { render, fireEvent, waitFor } from '@testing-library/react-native';
import CameraUse from '../CameraUse';

jest.mock('@expo/vector-icons', () => ({
    Fontisto: 'Fontisto',
    AntDesign: 'AntDesign',
}));

global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ predictions: ['object1', 'object2'] }),
    })
) as jest.Mock;

describe('CameraUse Component', () => {
    it('should display the photo when passed as prop', () => {
        const mockPhoto = {
            base64: 'base64image',
            uri: 'file://path/to/photo.jpg',
            width: 100,
            height: 100,
        };

        const { getByTestId } = render(
            <CameraUse
                photo={mockPhoto}
                handleRetakePhoto={jest.fn()}
                onDetectedObjects={jest.fn()}
            />
        );

        const image = getByTestId('photo-image');
        expect(image).toBeTruthy();
    });

    it('should call handleRetakePhoto when retake button is pressed', () => {
        const mockHandleRetakePhoto = jest.fn();
        const mockPhoto = {
            base64: 'base64image',
            uri: 'file://path/to/photo.jpg',
            width: 100,
            height: 100,
        };

        const { getByTestId } = render(
            <CameraUse
                photo={mockPhoto}
                handleRetakePhoto={mockHandleRetakePhoto}
                onDetectedObjects={jest.fn()}
            />
        );

        const retakeButton = getByTestId('retake-button');
        fireEvent.press(retakeButton);
        expect(mockHandleRetakePhoto).toHaveBeenCalled();
    });

    it('should call sendPhoto and send the image when send button is pressed', async () => {
        const mockPhoto = {
            base64: 'base64image',
            uri: 'file://path/to/photo.jpg',
            width: 100,
            height: 100,
        };

        const mockOnDetectedObjects = jest.fn();
        const { getByTestId } = render(
            <CameraUse
                photo={mockPhoto}
                handleRetakePhoto={jest.fn()}
                onDetectedObjects={mockOnDetectedObjects}
            />
        );

        const sendButton = getByTestId('send-photo-button');
        fireEvent.press(sendButton);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledTimes(1);
            expect(global.fetch).toHaveBeenCalledWith('http://192.168.1.49:5000/detect', expect.objectContaining({
                method: 'POST',
                body: expect.any(FormData),
            }));
            expect(mockOnDetectedObjects).toHaveBeenCalledWith(['object1', 'object2']);
        });
    });
});

