import React from 'react';
import { Typography } from '@material-ui/core';
import { shallow } from 'enzyme';
import PDStages from './PDStages';

describe('PDStage', () => {
    const init = () => {
        const defaultProps = {
            stage: { status: 'test', name: 'test' },
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
        expect(wrapper.find(Typography).exists()).toBeTruthy();
    });
});
