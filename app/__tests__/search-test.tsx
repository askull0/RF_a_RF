import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react-native';
import Search from '../search';
import { useRouter } from 'expo-router';
import { useRoute } from '@react-navigation/core';

jest.mock('@react-navigation/core', () => ({
    useRoute: jest.fn(() => ({
        params: {
            detectedItems: 'apple, banana',
        },
    })),
    useNavigation: jest.fn(),
}));

jest.mock('@expo/vector-icons', () => ({
    Fontisto: 'Fontisto',
    AntDesign: 'AntDesign',
}));

jest.mock('expo-router', () => ({useRouter: jest.fn(),}));
jest.mock('expo-camera', () => ({ Camera: 'Camera' }));

describe('Search component', () => {
    it('should add items to selectedItems when typing and delete one', () => {
        const mockPush = jest.fn();
        const { useRouter } = require('expo-router');
        useRouter.mockReturnValue({ push: mockPush });

        const { useRoute } = require('@react-navigation/core');
        useRoute.mockReturnValue({
            params: {
                detectedItems: 'apple, banana',
            },
        });

        render(<Search />);

        fireEvent.changeText(screen.getByPlaceholderText('Search ingredients ...'), 'carrot');
        fireEvent.press(screen.getByText('carrot'));

        expect(screen.getByText('carrot')).toBeTruthy();

        fireEvent.press(screen.getByTestId('delete-button-2'));
        expect(screen.queryByText('carrot')).toBeNull();
    });

});

describe('Search integration test', () => {
    it('should add items, display them, and navigate to list of recipes', async () => {
        const mockPush = jest.fn();
        const { useRouter } = require('expo-router');
        useRouter.mockReturnValue({ push: mockPush });

        render(<Search />);

        const addIngredient = (ingredient: string) => {
            fireEvent.changeText(screen.getByPlaceholderText('Search ingredients ...'), ingredient);
            fireEvent.press(screen.getByText(ingredient));
            expect(screen.getByText(ingredient)).toBeTruthy();
        };

        addIngredient('carrot');
        fireEvent.press(screen.getByTestId('delete-button-2'));
        expect(screen.queryByText('carrot')).toBeNull();

        addIngredient('onion');

        fireEvent.press(screen.getByText('Find Recipes'));
        await waitFor(() => {
            expect(mockPush).toHaveBeenCalledWith({
                pathname: '/recipeList',
                params: expect.objectContaining({
                    selectedItems: ['apple', 'banana', 'onion'],
                }),
            });
        });
    });
});

