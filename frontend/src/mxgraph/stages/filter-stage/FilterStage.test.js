import React from 'react';
import { shallow } from 'enzyme';
import FilterStage from './FilterStage';
import { ConfiguredStageWithIcon } from '../../sidebar/stage-icon';

describe('FilterStage', () => {
    const init = () => {
        const defaultProps = {
            stage: { name: 'test', operation: 'test' }
        };

        return shallow(<FilterStage {...defaultProps} />);
    };

    it('should render without crashes', () => {
        const wrapper = init();
        expect(wrapper.find(ConfiguredStageWithIcon).exists()).toBeTruthy();
    });
});
