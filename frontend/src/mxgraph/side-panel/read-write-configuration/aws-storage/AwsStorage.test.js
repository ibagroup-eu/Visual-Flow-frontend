import React from 'react';
import ReadTextFields from '../../../../components/rw-text-fields';
import SelectField from '../../../../components/select-field';
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
        expect(wrapper.find(SelectField).exists()).toBeTruthy();
        expect(wrapper.find(ReadTextFields).exists()).toBeTruthy();
    });
});
