import React from 'react';
import { useTranslation } from 'react-i18next';

import { shallow } from 'enzyme';
import JoinStage from './JoinStage';
import { JobStageTag } from '../../../components/stage-tag';
import { Parameter } from '../parameters';

jest.mock('react-i18next', () => ({
    ...jest.requireActual('react-i18next'),
    useTranslation: jest.fn()
}));

describe('JoinStage', () => {
    const init = () => {
        const defaultProps = {
            stage: {
                leftColumns: 'id',
                rightColumns: 'id',
                name: 'test',
                operation: 'test',
                joinType: 'test'
            }
        };

        useTranslation.mockImplementation(() => ({ t: x => x }));

        const wrapper = shallow(<JoinStage {...defaultProps} />);

        return wrapper;
    };

    afterEach(() => useTranslation.mockClear());

    it('should render without crashes', () => {
        const wrapper = init();
        expect(wrapper).toBeDefined();
    });

    it('should render JobStageTag', () => {
        const wrapper = init();
        expect(wrapper.find(JobStageTag)).toBeDefined();
    });

    it('should render Parameters', () => {
        const wrapper = init();
        expect(wrapper.find(Parameter)).toHaveLength(2);
    });
});
