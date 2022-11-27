import React from 'react';
import { Typography } from '@material-ui/core';
import { shallow } from 'enzyme';
import Parameter from './Parameter';

describe('Parameter', () => {
    it('should render without crashes', () => {
        const defaultProps = {
            name: 'test',
            children: {}
        };

        const wrapper = shallow(<Parameter {...defaultProps} />);
        expect(wrapper.find(Typography).exists()).toBeTruthy();
    });
});
