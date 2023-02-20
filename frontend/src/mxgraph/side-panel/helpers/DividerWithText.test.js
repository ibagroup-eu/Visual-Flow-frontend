import React from 'react';
import { shallow } from 'enzyme';
import { Box, Typography } from '@material-ui/core';
import DividerWithText from './DividerWithText';

describe('DividerWithText', () => {
    it('should render without crashes', () => {
        const wrapper = shallow(<DividerWithText children="children" />);
        expect(wrapper.find(Box).exists()).toBeTruthy();
        expect(wrapper.find(Typography).exists()).toBeTruthy();
    });

    it('should use different types', () => {
        expect(
            shallow(<DividerWithText children="children" />)
                .find(Typography)
                .prop('variant')
        ).toBe('caption');

        expect(
            shallow(<DividerWithText children="children" type="res" />)
                .find(Typography)
                .prop('variant')
        ).toBe('subtitle1');
    });
});
