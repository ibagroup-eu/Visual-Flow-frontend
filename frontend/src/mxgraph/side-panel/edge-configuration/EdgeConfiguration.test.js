import { mount } from 'enzyme';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { TextField } from '@material-ui/core';
import EdgeConfiguration from './EdgeConfiguration';
import SaveCancelButtons from '../buttons';

jest.mock('react-i18next', () => ({
    ...jest.requireActual('react-i18next'),
    useTranslation: jest.fn()
}));

describe('EdgeConfiguration', () => {
    let wrapper;
    let props;

    beforeEach(() => {
        props = {
            configuration: {},
            state: {},
            setState: jest.fn(),
            saveCell: jest.fn(),
            setPanelDirty: jest.fn(),
            sourceAndTarget: {},
            ableToEdit: true
        };

        useTranslation.mockImplementation(() => ({ t: x => x }));
        wrapper = mount(<EdgeConfiguration {...props} />);
    });

    afterEach(() => useTranslation.mockClear());

    it('should render component', () => {
        expect(wrapper).toBeDefined();
    });
    it('should calls saveCell prop', () => {
        wrapper.find(SaveCancelButtons).invoke('saveCell')();
        expect(props.saveCell).toHaveBeenCalled();
    });
    it('should cancel changes', () => {
        wrapper.find(SaveCancelButtons).invoke('cancelChanges')();
        expect(props.setState).toHaveBeenCalled();
        expect(props.setPanelDirty).toHaveBeenCalledWith(false);
    });
    it('should calls handleInputChange func', () => {
        wrapper.find(TextField).invoke('onChange')({ target: { value: 'test' } });
        expect(props.setState).toHaveBeenCalled();
        expect(props.setPanelDirty).toHaveBeenCalledWith(true);
    });
});
