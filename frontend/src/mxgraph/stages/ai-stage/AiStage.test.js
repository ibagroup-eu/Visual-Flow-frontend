import React from 'react';
import { shallow } from 'enzyme';
import AiStage from './AiStage';
import { ConfiguredStageWithIcon } from '../../sidebar/stage-icon';

describe('AiStage', () => {
    const init = () => {
        const defaultProps = {
            stage: { name: 'test', operation: 'test' }
        };

        return shallow(<AiStage {...defaultProps} />);
    };

    it('should render without crashes', () => {
        const wrapper = init();
        expect(wrapper.find(ConfiguredStageWithIcon).exists()).toBeTruthy();
    });
});
