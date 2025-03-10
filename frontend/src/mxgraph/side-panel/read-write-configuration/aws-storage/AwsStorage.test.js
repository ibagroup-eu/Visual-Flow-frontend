import React from 'react';
import ReadTextFields from '../../../../components/rw-text-fields';
import ParamsSwitchField from '../../../sidebar/params/fields/switch/ParamsSwitchField';
import AwsStorage from './AwsStorage';
import { shallow } from 'enzyme';

describe('AwsStorage', () => {
    const init = () => {
        const defaultProps = {
            inputValues: { anonymousAccess: 'false' },
            ableToEdit: true,
            handleInputChange: jest.fn(),
            openModal: jest.fn(),
            connectionPage: false,
            connection: {}
        };

        const wrapper = shallow(<AwsStorage {...defaultProps} />);

        return wrapper;
    };

    it('should render without crashes', () => {
        const wrapper = init();
        expect(wrapper.find(ParamsSwitchField).exists()).toBeTruthy();
        expect(wrapper.find(ReadTextFields).exists()).toBeTruthy();
    });

    it('should render without crashes 2', () => {
        const wrapper = init({ inputValues: { ssl: 'true' } });
        expect(wrapper.find(ParamsSwitchField).exists()).toBeTruthy();
        expect(wrapper.find(ReadTextFields).exists()).toBeTruthy();
    });
});
