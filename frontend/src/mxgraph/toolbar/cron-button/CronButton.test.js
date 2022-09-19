import { useTranslation } from 'react-i18next';
import React from 'react';
import { IconButton } from '@material-ui/core';
import EventIcon from '@material-ui/icons/Event';
import CronModal from '../../../components/cron-modal';
import { shallow } from 'enzyme';
import CronButton from './CronButton';

jest.mock('react-i18next', () => ({
    ...jest.requireActual('react-i18next'),
    useTranslation: jest.fn()
}));

describe('CronButton', () => {
    const init = (props = {}) => {
        const defaultProps = {
            pipeline: {},
            refresh: jest.fn(),
            changesNotSaved: true,
            projectId: 'test'
        };

        useTranslation.mockImplementation(() => ({ t: x => x }));

        const wrapper = shallow(<CronButton {...defaultProps} {...props} />);
        return wrapper;
    };

    afterEach(() => useTranslation.mockClear());

    it('should render without crashes', () => {
        const wrapper = init({});
        expect(wrapper.find(CronModal).exists()).toBeTruthy();
        expect(wrapper.find(IconButton).exists()).toBeTruthy();
    });
    it('should render EventIcon', () => {
        const wrapper = init({
            changesNotSaved: false,
            pipeline: { cron: 'test' }
        });
        expect(wrapper.find(EventIcon).exists()).toBeTruthy();
    });
    it('should call closeCronModal func', () => {
        const wrapper = init({});
        wrapper.find(CronModal).prop('onClose')();
    });
    it('should call openCronModal func', () => {
        const wrapper = init({});
        wrapper.find(IconButton).prop('onClick')();
    });
});
