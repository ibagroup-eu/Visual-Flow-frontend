import React from 'react';
import { shallow } from 'enzyme';
import NotificationStage from './NotificationStage';
import { PipelineStageTag } from '../../../components/stage-tag';

describe('NotificationStage', () => {
    const init = () => {
        const defaultProps = {
            stage: { name: 'test', operation: 'test', addressees: 'test' },
            params: []
        };

        const wrapper = shallow(<NotificationStage {...defaultProps} />);

        return wrapper;
    };

    it('should render without crashes', () => {
        const wrapper = init();
        expect(wrapper).toBeDefined();
    });

    it('should render PipelineStageTag', () => {
        const wrapper = init();
        expect(wrapper.find(PipelineStageTag)).toBeDefined();
    });
});
