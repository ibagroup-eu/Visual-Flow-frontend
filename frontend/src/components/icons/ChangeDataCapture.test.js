import React from 'react';
import { shallow } from 'enzyme';
import ChangeDataCapture from './ChangeDataCapture';

describe('ChangeDataCapture', () => {
    it('should render without crashes', () => {
        const wrapper = shallow(<ChangeDataCapture />);
        expect(wrapper).toBeDefined();
    });
});
