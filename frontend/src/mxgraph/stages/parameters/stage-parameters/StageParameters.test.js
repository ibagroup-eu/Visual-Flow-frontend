import React from 'react';
import { shallow } from 'enzyme';
import StageParameters from './StageParameters';

describe('StageParameters', () => {
    const props = {
        children: {}
    };
    it('should render without crashes', () => {
        const wrapper = shallow(<StageParameters {...props} />);
        expect(wrapper).toBeDefined();
    });
});
