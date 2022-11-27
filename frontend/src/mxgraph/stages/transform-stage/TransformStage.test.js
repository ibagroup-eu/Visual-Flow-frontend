import React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'enzyme';
import TransformStage from './TransformStage';
import { Parameter } from '../parameters';

jest.mock('react-i18next', () => ({
    ...jest.requireActual('react-i18next'),
    useTranslation: jest.fn()
}));

describe('TransformStage', () => {
    const init = () => {
        const defaultProps = {
            stage: {
                name: 'test',
                mode: 'Full_SQL',
                tableName: 'testTable',
                operation: 'test'
            }
        };

        useTranslation.mockImplementation(() => ({ t: x => x }));

        const wrapper = shallow(<TransformStage {...defaultProps} />);

        return wrapper;
    };

    afterEach(() => useTranslation.mockClear());

    it('should render without crashes', () => {
        const wrapper = init();
        expect(wrapper).toBeDefined();
    });

    it('should render Parameter', () => {
        const wrapper = init();
        wrapper.setProps({
            stage: {
                mode: 'Full_SQL'
            }
        });
        expect(wrapper.find(Parameter)).toHaveLength(1);
    });
});
