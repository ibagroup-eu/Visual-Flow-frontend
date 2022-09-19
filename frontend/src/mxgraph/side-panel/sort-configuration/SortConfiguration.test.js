import React from 'react';
import { useTranslation } from 'react-i18next';
import SelectField from '../../../components/select-field';
import PropertyList from '../property-list';
import { shallow, mount } from 'enzyme';
import SortConfiguration from './SortConfiguration';

jest.mock('react-i18next', () => ({
    ...jest.requireActual('react-i18next'),
    useTranslation: jest.fn()
}));

describe('SortConfiguration', () => {
    const init = (props = {}, returnProps = false, func = shallow) => {
        const defaultProps = {
            state: { name: 'test' },
            ableToEdit: true,
            onChange: jest.fn()
        };

        useTranslation.mockImplementation(() => ({ t: x => x }));

        const wrapper = func(<SortConfiguration {...defaultProps} {...props} />);

        return returnProps ? [wrapper, { ...defaultProps, ...props }] : [wrapper];
    };

    afterEach(() => useTranslation.mockClear());

    it('should render without crashes', () => {
        const [wrapper] = init({}, true);
        expect(wrapper.find(SelectField).exists()).toBeTruthy();
        expect(wrapper.find(PropertyList).exists()).toBeTruthy();
    });

    it('should run onChange prop', () => {
        const [wrapper, props] = init(
            { state: { name: 'test', orderColumns: 'string' } },
            true,
            mount
        );
        wrapper.find(PropertyList).prop('onChange')([1, 2, 3]);
        expect(props.onChange).toHaveBeenCalled();
    });

    it('should run onAddItem prop', () => {
        const [wrapper, props] = init(true, mount);
        wrapper.find(PropertyList).prop('onAddItem')();
        expect(props.onChange).toHaveBeenCalled();
    });
});
