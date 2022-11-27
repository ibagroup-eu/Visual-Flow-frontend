import React from 'react';
import { shallow } from 'enzyme';
import Transform from './Transform';

describe('Transform', () => {
    it('should render without crashes', () => {
        const wrapper = shallow(<Transform />);
        expect(wrapper).toBeDefined();
    });
});
