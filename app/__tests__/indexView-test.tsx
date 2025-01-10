import * as React from 'react';
import renderer from 'react-test-renderer';
import Index from '../';
import {render} from "@testing-library/react-native";


it('renders correctly', () => {
    const tree = renderer.create(<Index />).toJSON();
    expect(tree).toMatchSnapshot();
});

test('renders welcome text', () => {
    const { getByText } = render(<Index />);
    expect(getByText('Welcome to the application!!')).toBeTruthy();
});

test('renders middle text', () => {
    const { getByText } = render(<Index />);
    expect(getByText('You can find recipes by taking a photo of the ingredients or simply by searching manually.')).toBeTruthy();
});