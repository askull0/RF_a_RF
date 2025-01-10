import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import Index from '../';

jest.mock('expo-router', () => ({
    useRouter: jest.fn(),
}));

describe('Index Component button Take a Photo', () => {
    it('navigates correctly on button: Take a Photo', () => {
        const mockPush = jest.fn();
        const { useRouter } = require('expo-router');
        useRouter.mockReturnValue({ push: mockPush });

        const { getByText } = render(<Index />);
        const takePhotoButton = getByText('Take a Photo');

        fireEvent.press(takePhotoButton);
        expect(mockPush).toHaveBeenCalledWith('/camera');
    });
});

describe('Index Component Search Recipes', () => {
    it('navigates correctly on button: Search Recipes', () => {
        const mockPush = jest.fn();
        const { useRouter } = require('expo-router');
        useRouter.mockReturnValue({ push: mockPush });

        const { getByText } = render(<Index />);

        const takePhotoButton = getByText('Search Recipes');
        fireEvent.press(takePhotoButton);

        expect(mockPush).toHaveBeenCalledWith('/search');
    });
});