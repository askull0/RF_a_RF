import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import Index from '../';

jest.mock('expo-router', () => ({
    useRouter: jest.fn(),
}));

describe('Button Take a Photo', () => {
    it('navigates correctly on button: Take a Photo to camera', () => {
        const mockPush = jest.fn();
        const { useRouter } = require('expo-router');
        useRouter.mockReturnValue({ push: mockPush });

        render(<Index />);

        fireEvent.press(screen.getByTestId('button-take-photo'));
        expect(mockPush).toHaveBeenCalledWith('/camera');
    });
});

describe('Button Search Recipes', () => {
    it('navigates correctly on button: Search Recipes to search', () => {
        const mockPush = jest.fn();
        const { useRouter } = require('expo-router');
        useRouter.mockReturnValue({ push: mockPush });

        render(<Index />);

        fireEvent.press(screen.getByTestId('button-search-recipes'));
        expect(mockPush).toHaveBeenCalledWith('/search');
    });
});