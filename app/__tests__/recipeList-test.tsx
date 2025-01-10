import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import RecipeList from '../recipeList';

jest.mock('expo-router', () => ({
    useRouter: jest.fn(),
    useLocalSearchParams: jest.fn().mockReturnValue({ recipes: '[]', selectedItems: [] }), // Mocking params
}));

describe('RecipeList - Filter Interaction', () => {
    it('should open and close the filters modal when the filter button is pressed', async () => {
        const { getByText, getByTestId, queryByText } = render(<RecipeList />);

        expect(queryByText('Select Filters')).toBeNull();
        fireEvent.press(getByText('Filters (0)'));

        await waitFor(() => {
            expect(queryByText('Select Filters')).toBeTruthy();
        });

        fireEvent.press(getByText('Apply Filters'));
        await waitFor(() => {
            expect(queryByText('Select Filters')).toBeNull();
        });
    });

    it('should apply a selected filter and update the active filters count', async () => {
        const { getByText, queryByText } = render(<RecipeList />);

        fireEvent.press(getByText('Filters (0)'));

        fireEvent.press(getByText('Time'));

        fireEvent.press(getByText('<15'));

        expect(getByText('Filters (1)')).toBeTruthy();

        fireEvent.press(getByText('Apply Filters'));

        await waitFor(() => {
            expect(queryByText('Select Filters')).toBeNull();
        });
    });

    it('should reset all filters when "Clear Filters" is pressed', async () => {
        const { getByText } = render(<RecipeList />);

        fireEvent.press(getByText('Filters (0)'));

        fireEvent.press(getByText('Time'));

        fireEvent.press(getByText('<15'));

        expect(getByText('Filters (1)')).toBeTruthy();

        fireEvent.press(getByText('Clear Filters'));

        expect(getByText('Filters (0)')).toBeTruthy();
    });
});