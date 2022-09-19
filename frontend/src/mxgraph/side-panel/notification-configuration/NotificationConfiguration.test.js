import React from 'react';
import { useTranslation } from 'react-i18next';
import { TextField, IconButton } from '@material-ui/core';
import ClearButton from '../helpers/ClearButton';
import { shallow, mount } from 'enzyme';
import NotificationConfiguration from './NotificationConfiguration';

jest.mock('react-i18next', () => ({
    ...jest.requireActual('react-i18next'),
    useTranslation: jest.fn()
}));

describe('NotificationConfiguration', () => {
    const init = (props = {}, returnProps = false, func = shallow) => {
        const defaultProps = {
            state: { name: 'test' },
            ableToEdit: true,
            onChange: jest.fn(),
            openModal: jest.fn(),
            params: []
        };
        useTranslation.mockImplementation(() => ({ t: x => x }));
        const wrapper = func(
            <NotificationConfiguration {...defaultProps} {...props} />
        );
        return returnProps ? [wrapper, { ...defaultProps, ...props }] : [wrapper];
    };
    afterEach(() => useTranslation.mockClear());

    it('should render without crashes', () => {
        const [wrapper] = init({}, true);
        expect(wrapper.find(TextField).exists()).toBeTruthy();
        expect(wrapper.find(ClearButton).exists()).toBeTruthy();
    });
    it('should run onChange prop', () => {
        const [wrapper, props] = init({}, true);
        wrapper
            .find(TextField)
            .at(0)
            .prop('onChange')({
            target: { name: 'test', value: 'text' }
        });
        expect(props.onChange).toHaveBeenCalledTimes(1);
    });
    it('should run onChange prop', () => {
        const [wrapper, props] = init({}, true);
        wrapper
            .find(TextField)
            .at(1)
            .prop('onChange')({
            target: { name: 'test', value: 'text' }
        });
        expect(props.onChange).toHaveBeenCalledTimes(1);
    });
    it('should run openModal prop', () => {
        const [wrapper, props] = init({}, true, mount);
        wrapper
            .find(IconButton)
            .at(0)
            .prop('onClick')();
        expect(props.openModal).toHaveBeenCalledTimes(1);
    });
});
