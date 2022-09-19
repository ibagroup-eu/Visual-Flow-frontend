import React from 'react';
import { shallow } from 'enzyme';
import { IconButton } from '@material-ui/core';
import { Cancel } from '@material-ui/icons';
import { READWRITE } from '../../constants';
import { JOIN } from '../../constants';
import ClearButton from './ClearButton';
import { any } from 'prop-types';

describe('ClearButton', () => {
    const init = (props = {}, returnProps = false, func = shallow) => {
        const defaultProps = {
            name: 'test',
            value: any,
            ableToEdit: true,
            handleInputChange: jest.fn(),
            type: READWRITE
        };

        const wrapper = func(<ClearButton {...defaultProps} {...props} />);

        return returnProps ? [wrapper, { ...defaultProps, ...props }] : [wrapper];
    };
    it('should render without crashes', () => {
        const [wrapper] = init({}, true);
        expect(wrapper.find(IconButton).exists()).toBeTruthy();
        expect(wrapper.find(Cancel).exists()).toBeTruthy();
    });
    it('test onClick event for READWRITE type', () => {
        const [wrapper, props] = init({}, true);
        wrapper.find(IconButton).prop('onClick')();
        expect(props.handleInputChange).toHaveBeenCalledWith({
            target: { name: 'test', value: '' }
        });
    });
    it('test onClick event for JOIN type', () => {
        const [wrapper, props] = init({ type: JOIN }, true);
        wrapper.find(IconButton).prop('onClick')();
        expect(props.handleInputChange).toHaveBeenCalledWith('test', '');
    });
});
