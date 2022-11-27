import React from 'react';
import { shallow } from 'enzyme';
import SortStage from './SortStage';
import { SORT_TYPES } from '../../constants';

describe('SortStage', () => {
    const init = () => {
        const defaultProps = {
            stage: { name: 'test', operation: 'test' }
        };

        return shallow(<SortStage {...defaultProps} />);
    };

    it('should render without crashes', () => {
        const wrapper = init();
        expect(wrapper).toBeDefined();
    });
    it('should render without crashes', () => {
        const wrapper = init();
        wrapper.setProps({
            stage: { name: 'test', operation: 'test', sortType: SORT_TYPES[0].value }
        });
    });
});
