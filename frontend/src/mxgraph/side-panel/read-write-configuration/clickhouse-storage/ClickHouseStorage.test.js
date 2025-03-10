import React from 'react';
import { shallow } from 'enzyme';
import ReadTextFields from '../../../../components/rw-text-fields';
import ReadWriteEditorField from '../../../../components/rw-editor-field';
import ParamsSwitchField from '../../../sidebar/params/fields/switch/ParamsSwitchField';
import { READ, WRITE } from '../../../constants';
import WriteMode from '../helpers/WriteMode';
import ClickHouseStorage from './ClickHouseStorage';

describe('ClickHouseStorage', () => {
    const init = (props = {}, func = shallow) => {
        const defaultProps = {
            inputValues: { operation: WRITE, customSql: 'true' },
            ableToEdit: true,
            handleInputChange: jest.fn(),
            openModal: jest.fn(),
            connectionPage: false,
            connection: {}
        };

        const wrapper = func(<ClickHouseStorage {...defaultProps} {...props} />);

        return [wrapper, { ...defaultProps, ...props }];
    };

    it('should render without crashes', () => {
        const [wrapper] = init();
        expect(wrapper.find(ReadWriteEditorField).prop('name')).toEqual(
            'option.dbtable'
        );
        expect(wrapper.find(WriteMode)).toHaveLength(1);
    });

    it('should render schema and table fields when customSql is false', () => {
        const [wrapper] = init({
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
        const [wrapper] = init({
            inputValues: {
                operation: READ,
                customSql: undefined
            }
        });
        expect(wrapper.find(ParamsSwitchField).exists()).toBeTruthy();
    });
});
