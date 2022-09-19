import React from 'react';
import { shallow } from 'enzyme';
import { Box, Typography } from '@material-ui/core';
import DividerWithText from './DividerWithText';
import { any } from 'prop-types';

describe('DividerWithText', () => {
    it('should render without crashes', () => {
        const wrapper = shallow(<DividerWithText children={any} />);
        expect(wrapper.find(Box).exists()).toBeTruthy();
        expect(wrapper.find(Typography).exists()).toBeTruthy();
    });
});
