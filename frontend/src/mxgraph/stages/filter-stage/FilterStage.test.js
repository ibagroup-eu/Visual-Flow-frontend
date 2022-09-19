import React from 'react';
import { Typography } from '@material-ui/core';
import { shallow } from 'enzyme';
import FilterStage from './FilterStage';

describe('FilterStage', () => {
    const init = () => {
        const defaultProps = {
            stage: { name: 'test', operation: 'test' }
        };

        const wrapper = shallow(<FilterStage {...defaultProps} />);

        return wrapper;
    };

    it('should render without crashes', () => {
        const wrapper = init();
        expect(wrapper.find(Typography).exists()).toBeTruthy();
    });
});
