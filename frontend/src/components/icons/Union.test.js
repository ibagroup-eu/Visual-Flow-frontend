import React from 'react';
import { shallow } from 'enzyme';
import Union from './Union';

describe('Union', () => {
    it('should render without crashes', () => {
        const wrapper = shallow(<Union />);
        expect(wrapper).toBeDefined();
    });
});
