import React from 'react';
import { shallow } from 'enzyme';
import { Typography } from '@material-ui/core';
import SortStage from './SortStage';
import { SORT_TYPES } from '../../constants';

describe('SortStage', () => {
    const init = () => {
        const defaultProps = {
            stage: { name: 'test', operation: 'test' }
        };

        const wrapper = shallow(<SortStage {...defaultProps} />);

        return wrapper;
    };

    it('should render without crashes', () => {
        const wrapper = init();
        expect(wrapper.find(Typography).exists()).toBeTruthy();
    });
    it('should render without crashes', () => {
        const wrapper = init();
        wrapper.setProps({
            stage: { name: 'test', operation: 'test', sortType: SORT_TYPES[0].value }
        });
    });
});
