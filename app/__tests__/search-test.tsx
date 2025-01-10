import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
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
const { queryByText } = render(<Search />);
jest.mock('expo-camera', () => ({ Camera: 'Camera' }));

describe('Search component', () => {
    it('should add items to selectedItems when typing and selecting a suggestion', () => {
        const mockPush = jest.fn();
        (useRouter as jest.Mock).mockReturnValue({
            push: mockPush,
        });

        (useRoute as jest.Mock).mockReturnValue({
            params: {
                detectedItems: 'apple, banana',
            },
        });

        const { getByPlaceholderText, getByText, getByTestId } = render(<Search />);

        fireEvent.changeText(getByPlaceholderText('Search ingredients ...'), 'carrot');
        fireEvent.press(getByText('carrot'));

        expect(getByText('carrot')).toBeTruthy();

        fireEvent.press(getByTestId('delete-button-0'));
        expect(queryByText('carrot')).toBeNull();
    });

});

describe('Search integration test', () => {
    it('should add items, display them, and navigate after finding recipes', async () => {
        const mockPush = jest.fn();
        (useRouter as jest.Mock).mockReturnValue({ push: mockPush });

        const { getByPlaceholderText, getByText, getByTestId, queryByText } = render(<Search />);
        const searchInput = getByPlaceholderText('Search ingredients ...');

        const addIngredient = (ingredient: string) => {
            fireEvent.changeText(searchInput, ingredient);
            fireEvent.press(getByText(ingredient));
            expect(getByText(ingredient)).toBeTruthy();
        };

        addIngredient('carrot');
        fireEvent.press(getByTestId('delete-button-2'));
        expect(queryByText('carrot')).toBeNull();

        addIngredient('onion');

        fireEvent.press(getByText('Find Recipes'));
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
