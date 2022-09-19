import React from 'react';
import ReadTextFields from '../../../../components/rw-text-fields';
import SelectField from '../../../../components/select-field';
import CosStorage from './CosStorage';
import { shallow } from 'enzyme';

describe('CosStorage', () => {
    const init = () => {
        const defaultProps = {
            inputValues: { authType: 'HMAC' },
            ableToEdit: true,
            handleInputChange: jest.fn(),
            openModal: jest.fn(),
            connectionPage: false,
            connection: {}
        };

        const wrapper = shallow(<CosStorage {...defaultProps} />);

        return wrapper;
    };

    it('should render without crashes', () => {
        const wrapper = init();
        expect(wrapper.find(SelectField).exists()).toBeTruthy();
        expect(wrapper.find(ReadTextFields).exists()).toBeTruthy();
    });

    it('ReadTextFields prop fields should be equal to iamFields', () => {
        const wrapper = init();
        wrapper.setProps({ inputValues: { authType: 'IAM' } });
        expect(wrapper.find(SelectField).exists()).toBeTruthy();
        expect(
            wrapper
                .find(ReadTextFields)
                .at(1)
                .prop('fields')
        ).toStrictEqual([{ field: 'iamApiKey' }, { field: 'iamServiceId' }]);
    });
});
