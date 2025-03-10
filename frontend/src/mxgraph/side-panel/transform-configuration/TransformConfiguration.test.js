import React from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'enzyme';
import SelectField from '../../../components/select-field';
import ReadTextFields from '../../../components/rw-text-fields';
import TransformConfiguration from './TransformConfiguration';
import ReadWriteEditorField from '../../../components/rw-editor-field';

jest.mock('react-i18next', () => ({
    ...jest.requireActual('react-i18next'),
    useTranslation: jest.fn()
}));

describe('TransformConfiguration', () => {
    const init = (props = {}, returnProps = false, func = shallow) => {
        const defaultProps = {
            state: { name: 'test', operation: 'TRANSFORM', mode: 'Full_SQL' },
            ableToEdit: true,
            onChange: jest.fn(),
            required: true,
            openModal: jest.fn()
        };
        useTranslation.mockImplementation(() => ({ t: x => x }));
        const wrapper = func(
            <TransformConfiguration {...defaultProps} {...props} />
        );
        return returnProps ? [wrapper, { ...defaultProps, ...props }] : [wrapper];
    };

    afterEach(() => useTranslation.mockClear());

    it('should render without crashes', () => {
        const [wrapper] = init({}, true);
        expect(wrapper.find(SelectField).exists()).toBeTruthy();
        expect(wrapper.find(ReadTextFields).exists()).toBeTruthy();
    });

    it('should not render ReadTextFields', () => {
        const [wrapper] = init(
            { state: { name: 'test', operation: 'TRANSFORM', mode: 'Full' } },
            true
        );
        expect(wrapper.find(ReadTextFields).exists()).toBeFalsy();
    });

    it('ReadTextFields should be render and change', () => {
        const [wrapper] = init({}, true);
        wrapper.find(ReadTextFields).prop('handleInputChange')({
            target: { name: 'test', value: 1 }
        });
    });

    it('TextFields should be render and change', () => {
        const [wrapper] = init({}, true);
        wrapper.find(ReadWriteEditorField).prop('onChange')({
            target: { name: 'test', value: 1 }
        });
    });
});
