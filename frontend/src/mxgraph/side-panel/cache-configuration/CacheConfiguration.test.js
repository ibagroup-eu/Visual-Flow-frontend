import React from 'react';
import { shallow, mount } from 'enzyme';
import { useTranslation } from 'react-i18next';

import { FormControlLabel, Switch, TextField } from '@material-ui/core';

import CacheConfiguration from './CacheConfiguration';

jest.mock('react-i18next', () => ({
    ...jest.requireActual('react-i18next'),
    useTranslation: jest.fn()
}));
describe('CacheConfiguration', () => {
    const init = (props = {}, returnProps = false, func = shallow) => {
        const defaultProps = {
            state: { name: 'test' },
            ableToEdit: true,
            onChange: jest.fn()
        };
        useTranslation.mockImplementation(() => ({ t: x => x }));
        const wrapper = func(<CacheConfiguration {...defaultProps} {...props} />);
        return returnProps ? [wrapper, { ...defaultProps, ...props }] : [wrapper];
    };

    afterEach(() => useTranslation.mockClear());

    it('onChange should run 5 times', () => {
        const [_, props] = init({}, true, mount);
        expect(props.onChange).toHaveBeenCalledTimes(5);
    });

    it('textField should be render and change', () => {
        const [wrapper] = init({}, true);
        const textField = wrapper.find(TextField);
        textField.at(0).simulate('change', { target: { name: 'test', value: 1 } });
    });

    it('onChange should not run', () => {
        const [_, props] = init({ state: { useDisk: true } }, true);
        expect(props.onChange).not.toHaveBeenCalled();
    });

    it('should render Switch', () => {
        const [wrapper, props] = init({}, true);

        expect(wrapper.find(FormControlLabel).length).toEqual(4);
        const sw = mount(
            wrapper
                .find(FormControlLabel)
                .at(0)
                .prop('control')
        );
        expect(sw.find(Switch).length).toEqual(1);

        sw.find(Switch).prop('onChange')({ target: { checked: true } });
        expect(props.onChange).toHaveBeenCalled();
    });
});
