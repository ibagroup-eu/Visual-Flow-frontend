import React from 'react';
import { shallow } from 'enzyme';
import { useTranslation } from 'react-i18next';
import { ProfilePageModal } from './ProfilePageModal';

jest.mock('react-i18next', () => ({
    ...jest.requireActual('react-i18next'),
    useTranslation: jest.fn()
}));

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn()
}));

describe('ProfilePageModal', () => {
    const init = () => {
        const defaultProps = {
            display: true,
            title: 'test',
            onClose: jest.fn(),
            userInfo: { accessToken: 'ololo' }
        };

        useTranslation.mockImplementation(() => ({ t: x => x }));

        return shallow(<ProfilePageModal {...defaultProps} />);
    };

    it('should render without crashes', () => {
        const wrapper = init();
        expect(wrapper).toBeDefined();
    });
});
