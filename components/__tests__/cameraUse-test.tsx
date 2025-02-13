import {render, fireEvent, waitFor, screen} from '@testing-library/react-native';
import CameraUse from '../CameraUse';

jest.mock('@expo/vector-icons', () => ({
    AntDesign: 'AntDesign',
    MaterialCommunityIcons: 'MaterialCommunityIcons',
    Entypo: 'Entypo',
}));

global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: function() {
        return Promise.resolve({ predictions: ['object1', 'object2'] });
    }
});

describe('CameraUse Component', () => {
    it('should display the picture when passed as prop', () => {
        const mockPicture = {
            uri: 'file://picture.jpg',
            width: 100,
            height: 100,
        };

        render(
            <CameraUse
                picture={mockPicture}
                handleResetPicture={jest.fn()}
                onDetectedObjects={jest.fn()}
            />
        );

        expect(screen.getByTestId('picture-image')).toBeTruthy();
    });

    it('should call handleRetakePicture when retake button is pressed', () => {
        const mockHandleResetPicture = jest.fn();
        const mockPicture = {
            uri: 'file://picture.jpg',
            width: 100,
            height: 100,
        };

         render(
            <CameraUse
                picture={mockPicture}
                handleResetPicture={mockHandleResetPicture}
                onDetectedObjects={jest.fn()}
            />
        );
        fireEvent.press(screen.getByTestId('retake-button'));
        expect(mockHandleResetPicture).toHaveBeenCalled();
    });

    it('should call sendPicture and send the image when send button is pressed', async () => {
        const mockPicture = {
            uri: 'file://picture.jpg',
            width: 100,
            height: 100,
        };
        const mockOnDetectedObjects = jest.fn();

        render(
            <CameraUse
                picture={mockPicture}
                handleResetPicture={jest.fn()}
                onDetectedObjects={mockOnDetectedObjects}
            />
        );

        fireEvent.press(screen.getByTestId('send-picture-button'));

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

