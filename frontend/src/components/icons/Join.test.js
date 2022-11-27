import React from 'react';
import { shallow } from 'enzyme';
import Join from './Join';

describe('Join', () => {
    it('should render without crashes', () => {
        const wrapper = shallow(<Join />);
        expect(wrapper).toBeDefined();
    });
});
