import React from 'react';
import ReadTextFields from '../../../../components/rw-text-fields';
import SelectField from '../../../../components/select-field';
import CosStorage from './CosStorage';
import { mount, shallow } from 'enzyme';

describe('CosStorage', () => {
    const init = (props = {}, func = shallow) => {
        const defaultProps = {
            inputValues: { authType: 'HMAC' },
            ableToEdit: true,
            handleInputChange: jest.fn(),
            openModal: jest.fn(),
            connectionPage: false,
            connection: {}
        };

        const wrapper = func(<CosStorage {...defaultProps} {...props} />);

        return [wrapper, { ...defaultProps, ...props }];
    };

    it('should render without crashes', () => {
        const [wrapper] = init();
        expect(wrapper.find(SelectField).exists()).toBeTruthy();
        expect(wrapper.find(ReadTextFields).exists()).toBeTruthy();
    });

    it('should render without crashes 2', () => {
        const [wrapper] = init({ inputValues: { authType: 'HMAC1' } }, mount);
        expect(wrapper.find(SelectField).exists()).toBeTruthy();
        expect(wrapper.find(ReadTextFields).exists()).toBeTruthy();
    });

    it('should render without crashes 3', () => {
        const [wrapper] = init({}, mount);
        expect(wrapper.find(SelectField).exists()).toBeTruthy();
        expect(wrapper.find(ReadTextFields).exists()).toBeTruthy();
    });

    it('ReadTextFields prop fields should be equal to iamFields', () => {
        const [wrapper] = init({ inputValues: { authType: 'IAM' } });
        expect(wrapper.find(SelectField).exists()).toBeTruthy();
        expect(
            wrapper
                .find(ReadTextFields)
                .at(1)
                .prop('fields')
        ).toStrictEqual([{ field: 'iamApiKey' }, { field: 'iamServiceId' }]);
    });
});
