import React from 'react';
import SelectField from '../../../components/select-field';
import UnionConfiguration from './UnionConfiguration';
import { shallow } from 'enzyme';

describe('SortConfiguration', () => {
    const init = () => {
        const defaultProps = {
            state: { name: 'test' },
            ableToEdit: true,
            onChange: jest.fn()
        };
        const wrapper = shallow(<UnionConfiguration {...defaultProps} />);
        return wrapper;
    };

    it('should render without crashes', () => {
        const wrapper = init();
        expect(wrapper.find(SelectField).exists()).toBeTruthy();
    });
});
