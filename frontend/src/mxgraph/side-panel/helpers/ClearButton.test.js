import React from 'react';
import { any } from 'prop-types';
import { shallow } from 'enzyme';
import { IconButton } from '@material-ui/core';
import { Cancel } from '@material-ui/icons';

import { READWRITE, JOIN } from '../../constants';
import ClearButton from './ClearButton';
import ConfirmationDialog from './ConfirmationDialog';

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
        expect(wrapper.find(IconButton).hasClass(/buttonHidden/)).toBeFalsy();
        wrapper.find(IconButton).prop('onClick')();
        expect(props.handleInputChange).toHaveBeenCalledWith('test', '');
    });

    it('should hide IconButton', () => {
        const [wrapper, props] = init({ hide: true }, true);
        expect(wrapper.find(IconButton).length).toEqual(1);
        expect(props.hide).toBeTruthy();
        expect(wrapper.find(IconButton).hasClass(/buttonHidden/)).toBeTruthy();
    });

    it('should render ConfirmationDialog', () => {
        const [wrapper] = init({ showConfirm: true }, true);
        wrapper.find(IconButton).prop('onClick')();

        expect(wrapper.find(ConfirmationDialog).prop('open')).toBeTruthy();

        wrapper.find(ConfirmationDialog).prop('onClose')();
        expect(wrapper.find(ConfirmationDialog).prop('open')).toBeFalsy();
    });

    it('should confirm clear', () => {
        const [wrapper, props] = init(
            { fieldToClear: true, fieldToClearValue: 'test' },
            true
        );
        wrapper.find(IconButton).prop('onClick')();

        expect(wrapper.find(ConfirmationDialog).prop('open')).toBeTruthy();

        wrapper.find(ConfirmationDialog).prop('onConfirm')();
        expect(wrapper.find(ConfirmationDialog).prop('open')).toBeFalsy();
        expect(props.handleInputChange).toHaveBeenCalledWith({
            target: { name: 'test', value: '' }
        });
    });
});
