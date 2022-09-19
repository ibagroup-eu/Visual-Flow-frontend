import React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'enzyme';
import ReadWriteStage from './ReadWriteStage';
import { STORAGES } from '../../constants';

jest.mock('react-i18next', () => ({
    ...jest.requireActual('react-i18next'),
    useTranslation: jest.fn()
}));

describe('ReadWriteStage', () => {
    const init = () => {
        const defaultProps = {
            stage: {
                storage: STORAGES.AWS.value
            }
        };

        useTranslation.mockImplementation(() => ({ t: x => x }));

        const wrapper = shallow(<ReadWriteStage {...defaultProps} />);

        return wrapper;
    };

    it('should render without crashes', () => {
        const wrapper = init();
        wrapper.setProps({
            stage: {
                storage: STORAGES.COS.value
            }
        });
        wrapper.setProps({
            stage: {
                storage: STORAGES.MONGO.value
            }
        });
        wrapper.setProps({
            stage: {
                storage: STORAGES.REDSHIFT.value
            }
        });
        wrapper.setProps({
            stage: {
                storage: STORAGES.CASSANDRA.value
            }
        });
        wrapper.setProps({
            stage: {
                storage: STORAGES.REDIS.value
            }
        });
        wrapper.setProps({
            stage: {
                storage: STORAGES.STDOUT.value
            }
        });
        wrapper.setProps({
            stage: {
                storage: STORAGES.ELASTIC.value
            }
        });
        wrapper.setProps({
            stage: {
                storage: STORAGES.DB2.value
            }
        });
    });
});
