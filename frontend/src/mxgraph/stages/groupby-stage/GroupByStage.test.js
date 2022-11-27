import React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'enzyme';
import GroupByStage from './GroupByStage';
import { TagsParameter } from '../parameters';

jest.mock('react-i18next', () => ({
    ...jest.requireActual('react-i18next'),
    useTranslation: jest.fn()
}));

describe('GroupByStage', () => {
    const init = () => {
        const defaultProps = {
            stage: {
                groupingColumns: 'one, two, three, four, five, six',
                name: 'test',
                operation: 'test'
            }
        };

        useTranslation.mockImplementation(() => ({ t: x => x }));

        const wrapper = shallow(<GroupByStage {...defaultProps} />);

        return wrapper;
    };

    afterEach(() => useTranslation.mockClear());

    it('should render without crashes', () => {
        const wrapper = init();
        expect(wrapper).toBeDefined();
    });

    it('should render TagsParameter', () => {
        const wrapper = init();
        expect(wrapper.find(TagsParameter)).toHaveLength(1);
    });
});
