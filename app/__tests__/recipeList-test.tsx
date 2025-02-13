import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react-native';
import RecipeList from '../recipeList';

jest.mock('expo-router', () => ({
    useRouter: jest.fn(),
    useLocalSearchParams: jest.fn().mockReturnValue({ recipes: '[]', selectedItems: [] }),
}));

describe('RecipeList and using filters ', () => {
    it('should open and close the filters modal when the filter is pressed', async () => {
        render(<RecipeList />);

        expect(screen.queryByText('Select Filters')).toBeNull();
        fireEvent.press(screen.getByText('Filters (0)'));

        await waitFor(() => {
            expect(screen.queryByText('Select Filters')).toBeTruthy();
        });

        fireEvent.press(screen.getByTestId('button-apply-filters'));
        await waitFor(() => {
            expect(screen.queryByText('Select Filters')).toBeNull();
        });
    });

    it('should apply a selected filter and update filters count', async () => {
        render(<RecipeList />);

        fireEvent.press(screen.getByText('Filters (0)'));

        fireEvent.press(screen.getByText('Time'));
        fireEvent.press(screen.getByText('<15'));
        fireEvent.press(screen.getByText('Apply Filters'));

        await waitFor(() => {
            expect(screen.queryByText('Select Filters')).toBeNull();
        });

        expect(screen.getByText('Filters (1)')).toBeTruthy();
    });

    it('should reset all filters when  button "Clear Filters" is pressed', async () => {
        render(<RecipeList />);

        fireEvent.press(screen.getByText('Filters (0)'));

        fireEvent.press(screen.getByText('Time'));
        fireEvent.press(screen.getByText('<15'));
        expect(screen.getByText('Filters (1)')).toBeTruthy();

        fireEvent.press(screen.getByText('Clear Filters'));

        expect(screen.getByText('Filters (0)')).toBeTruthy();
    });
});