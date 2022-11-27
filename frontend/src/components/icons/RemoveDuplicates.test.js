import React from 'react';
import { shallow } from 'enzyme';
import RemoveDuplicates from './RemoveDuplicates';

describe('RemoveDuplicates', () => {
    it('should render without crashes', () => {
        const wrapper = shallow(<RemoveDuplicates />);
        expect(wrapper).toBeDefined();
    });
});
