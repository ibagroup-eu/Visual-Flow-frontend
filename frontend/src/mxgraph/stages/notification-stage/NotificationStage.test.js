import React from 'react';
import { Typography } from '@material-ui/core';
import { shallow } from 'enzyme';
import NotificationStage from './NotificationStage';

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
        expect(wrapper.find(Typography).exists()).toBeTruthy();
    });
});
