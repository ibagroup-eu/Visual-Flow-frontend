import React from 'react';
import { shallow } from 'enzyme';
import { Typography } from '@material-ui/core';
import EdgeStage from './EdgeStage';

describe('EdgeStage', () => {
    const init = () => {
        const defaultProps = {
            stage: { text: 'test' }
        };

        const wrapper = shallow(<EdgeStage {...defaultProps} />);

        return wrapper;
    };

    it('should render without crashes', () => {
        const wrapper = init();
        expect(wrapper.find(Typography).exists()).toBeTruthy();
    });
});
