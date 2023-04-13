import React from 'react';
import { shallow } from 'enzyme';
import PDStages from './PDStages';
import { PipelineStageTag } from '../../../components/stage-tag';

describe('PDStage', () => {
    const init = () => {
        const defaultProps = {
            stage: { showLogs: true, name: 'test' },
            params: [],
            jobs: [],
            iconId: 'test',
            tooltipName: 'test',
            tooltipClass: 'test'
        };

        const wrapper = shallow(<PDStages {...defaultProps} />);

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
