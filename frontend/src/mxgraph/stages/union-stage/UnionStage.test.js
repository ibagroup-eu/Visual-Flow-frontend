import React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'enzyme';
import UnionStage from './UnionStage';

jest.mock('react-i18next', () => ({
    ...jest.requireActual('react-i18next'),
    useTranslation: jest.fn()
}));

describe('UnionStage', () => {
    const init = () => {
        const defaultProps = {
            stage: {
                name: 'test',
                type: 'test',
                operation: 'test'
            }
        };

        useTranslation.mockImplementation(() => ({ t: x => x }));

        const wrapper = shallow(<UnionStage {...defaultProps} />);

        return wrapper;
    };

    it('should render without crashes', () => {
        const wrapper = init();
        expect(wrapper).toBeDefined();
    });
});
