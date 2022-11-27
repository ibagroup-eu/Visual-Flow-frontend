import React from 'react';
import ReadTextFields from '../../../../components/rw-text-fields';
import SelectField from '../../../../components/select-field';
import { READ, WRITE } from '../../../constants';
import WriteMode from '../helpers/WriteMode';
import ClickHouseStorage from './ClickHouseStorage';
import { shallow } from 'enzyme';

describe('ClickHouseStorage', () => {
    const init = () => {
        const defaultProps = {
            inputValues: { operation: READ, customSql: 'true' },
            ableToEdit: true,
            handleInputChange: jest.fn(),
            openModal: jest.fn(),
            connectionPage: false,
            connection: {}
        };

        const wrapper = shallow(<ClickHouseStorage {...defaultProps} />);

        return wrapper;
    };

    it('should render without crashes', () => {
        const wrapper = init();
        expect(wrapper.find(SelectField).exists()).toBeTruthy();
        expect(
            wrapper
                .find(ReadTextFields)
                .at(2)
                .prop('fields')
        ).toEqual([{ field: 'option.dbtable', rows: 6 }]);
    });

    it('should render schema and table fields when customSql is false', () => {
        const wrapper = init();
        wrapper.setProps({
            inputValues: {
                customSql: 'false'
            }
        });
        expect(
            wrapper
                .find(ReadTextFields)
                .at(2)
                .prop('fields')
        ).toEqual([{ field: 'schema' }, { field: 'table' }]);
    });

    it('should render WriteMide when operation is WRITE', () => {
        const wrapper = init();
        wrapper.setProps({
            inputValues: {
                operation: WRITE
            }
        });
        expect(wrapper.find(WriteMode)).toHaveLength(1);
    });
});
