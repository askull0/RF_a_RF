import * as React from 'react';
import renderer from 'react-test-renderer';
import Index from '../';
import {render, screen} from "@testing-library/react-native";


it('renders correctly', () => {
    const tree = renderer.create(<Index />).toJSON();
    expect(tree).toMatchSnapshot();
});

it('renders welcome text', () => {
    render(<Index />);
    expect(screen.getByText('Welcome to the application!!')).toBeTruthy();
});

it('renders middle text', () => {
    render(<Index />);
    expect(screen.getByText('You can find recipes by taking a photo of the ingredients or simply by searching manually.')).toBeTruthy();
});