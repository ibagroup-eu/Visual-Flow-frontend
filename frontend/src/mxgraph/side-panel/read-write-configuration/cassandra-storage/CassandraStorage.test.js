import React from 'react';
import ReadTextFields from '../../../../components/rw-text-fields';
import SelectField from '../../../../components/select-field';
import { WRITE } from '../../../constants';
import CassandraStorage from './CassandraStorage';
import { shallow } from 'enzyme';

describe('CassandraStorage', () => {
    const init = () => {
        const defaultProps = {
            inputValues: { operation: WRITE },
            ableToEdit: true,
            handleInputChange: jest.fn(),
            openModal: jest.fn(),
            connectionPage: false,
            connection: {}
        };

        const wrapper = shallow(<CassandraStorage {...defaultProps} />);

        return wrapper;
    };

    it('should render without crashes', () => {
        const wrapper = init();
        expect(wrapper.find(SelectField).exists()).toBeTruthy();
        expect(wrapper.find(ReadTextFields).exists()).toBeTruthy();
    });
});
