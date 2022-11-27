import React from 'react';
import { Typography } from '@material-ui/core';
import { shallow } from 'enzyme';
import TagsParameter from './TagsParameter';

describe('TagsParameter', () => {
    const init = () => {
        const props = {
            values: ['one', 'two', 'three', 'four', 'five', 'six'],
            name: 'test'
        };

        return shallow(<TagsParameter {...props} />);
    };

    it('should render without crashes', () => {
        const wrapper = init();
        expect(wrapper).toBeDefined();
    });

    it('should render tags', () => {
        const wrapper = init();
        expect(wrapper.find(Typography).length).toBe(5);
    });
});
