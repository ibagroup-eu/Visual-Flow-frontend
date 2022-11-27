import React from 'react';
import { shallow } from 'enzyme';
import Filter from './Filter';

describe('Filter', () => {
    it('should render without crashes', () => {
        const wrapper = shallow(<Filter />);
        expect(wrapper).toBeDefined();
    });
});
