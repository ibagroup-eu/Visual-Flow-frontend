import React from 'react';
import { useTranslation } from 'react-i18next';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { shallow } from 'enzyme';
import { WRITE } from '../../../constants';
import FileFormat from '../helpers/FileFormat';
import WriteMode from '../helpers/WriteMode';
import SchemaModal from '../../../../components/schema-modal';
import UseSchema from '../helpers/UseSchema';
import CosProperties from './CosProperties';

jest.mock('react-i18next', () => ({
    ...jest.requireActual('react-i18next'),
    useTranslation: jest.fn()
}));

describe('CosProperties', () => {
    const init = (props = {}, returnProps = false, func = shallow) => {
        const defaultProps = {
            ableToEdit: true,
            onChange: jest.fn(),
            openModal: jest.fn(),
            handleInputChange: jest.fn(),
            fields: [{}],
            inputValues: { operation: WRITE, format: 'csv' }
        };
        useTranslation.mockImplementation(() => ({ t: x => x }));
        const wrapper = func(<CosProperties {...defaultProps} {...props} />);
        return returnProps ? [wrapper, { ...defaultProps, ...props }] : [wrapper];
    };
    afterEach(() => useTranslation.mockClear());

    it('should render without crashes', () => {
        const [wrapper] = init({}, true);
        expect(wrapper.find(WriteMode).exists()).toBeTruthy();
        expect(wrapper.find(Autocomplete).exists()).toBeTruthy();
    });
    it('SchemaModal should be render', () => {
        const [wrapper] = init({ inputValues: { format: 'avro' } }, true);
        expect(wrapper.find(SchemaModal).exists()).toBeTruthy();
        wrapper.find(SchemaModal).prop('onClose')();
    });
    it('should call handleInputChange prop', () => {
        const [wrapper, props] = init({ inputValues: { operation: WRITE } }, true);
        expect(wrapper.find(FileFormat).prop('value')).toEqual('');
        wrapper.find(Autocomplete).prop('onChange')([]);
        expect(props.handleInputChange).toHaveBeenCalled();
    });

    it('should call handleInputChange prop', () => {
        const [wrapper, props] = init({ inputValues: { format: 'avro' } }, true);
        wrapper.find(UseSchema).prop('onChange')();
        expect(props.handleInputChange).toHaveBeenCalled();
    });

    it('should call renderTags and renderInput prop of Autocomplete', () => {
        const [wrapper] = init({}, true);
        wrapper.find(Autocomplete).prop('renderTags')(['one', 'two'], jest.fn());
        wrapper.find(Autocomplete).prop('renderInput')();
    });
});
