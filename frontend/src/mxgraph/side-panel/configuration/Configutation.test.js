import { mount } from 'enzyme';
import React from 'react';
import Configuration from './Configuration';
import { Box, TextField } from '@material-ui/core';
import SaveCancelButtons from '../buttons/SaveCancelButtons';
import { useTranslation } from 'react-i18next';
import ParametersModal from '../read-write-configuration/parameters-modal';
import { CDC, JOIN } from '../../constants';

jest.mock('react-i18next', () => ({
    ...jest.requireActual('react-i18next'),
    useTranslation: jest.fn()
}));

const FakeComponent = props => <fake {...props} />;

describe('Configuration', () => {
    const init = (props = {}, returnProps = false, func = mount) => {
        const defaultProps = {
            configuration: {},
            ableToEdit: true,
            isDisabled: jest.fn(),
            saveCell: jest.fn(),
            setPanelDirty: jest.fn(),
            swapEdges: jest.fn(),
            selectedStorage: jest.fn(),
            sidePanelIsOpen: true,
            graph: { getSelectionCell: jest.fn(), getIncomingEdges: jest.fn() },
            Component: FakeComponent,
            connections: []
        };

        useTranslation.mockImplementation(() => ({ t: x => x }));

        const wrapper = func(<Configuration {...defaultProps} {...props} />);

        return returnProps ? [wrapper, { ...defaultProps, ...props }] : [wrapper];
    };

    it('should render without crashes', () => {
        const [wrapper] = init({}, true, mount);
        expect(wrapper.find(Box).exists()).toBeTruthy();
        expect(wrapper.find(TextField).exists()).toBeTruthy();
    });

    it('selectedStorage func should run', () => {
        const [_, props] = init(
            {
                configuration: {
                    operation: 'READ' || 'WRITE',
                    storage: 'test',
                    connectionName: 'test'
                }
            },
            true,
            mount
        );

        expect(props.selectedStorage).toHaveBeenCalledWith('test');
    });

    it('cancelChanges func should run', () => {
        const [wrapper, props] = init({}, true, mount);

        wrapper.find(SaveCancelButtons).prop('cancelChanges')();

        expect(props.setPanelDirty).toHaveBeenCalledWith(false);
    });

    it('handleSaveCell func should run', () => {
        const [wrapper] = init(
            {
                configuration: {
                    operation: 'CDC'
                }
            },
            true,
            mount
        );

        wrapper.find(SaveCancelButtons).prop('saveCell')();

        wrapper.setProps({
            configuration: {
                operation: 'JOIN'
            }
        });

        wrapper.update();

        wrapper.find(SaveCancelButtons).prop('saveCell')();

        wrapper.setProps({
            configuration: {
                operation: 'test'
            }
        });

        wrapper.update();

        wrapper.find(SaveCancelButtons).prop('saveCell')();
    });

    it('should handle onChange', () => {
        const [wrapper] = init({ configuration: { name: '' } });

        expect(wrapper.find(TextField).prop('value')).toBe('');

        wrapper.find(ParametersModal).prop('onChange')('name', 'value_1');

        wrapper.update();

        expect(wrapper.find(TextField).prop('value')).toBe('value_1');
    });

    it('should close / open a modal', () => {
        const [wrapper] = init();

        expect(wrapper.find(ParametersModal).prop('display')).toBeFalsy();

        wrapper.find(FakeComponent).prop('openModal')();

        wrapper.update();

        expect(wrapper.find(ParametersModal).prop('display')).toBeTruthy();

        wrapper.find(ParametersModal).prop('onClose')();

        wrapper.update();

        expect(wrapper.find(ParametersModal).prop('display')).toBeFalsy();
    });

    it('should handle onSetValue', () => {
        const [wrapper] = init({ configuration: {} });

        expect(wrapper.find(FakeComponent).prop('state')).toEqual({});

        wrapper.find(ParametersModal).prop('onSetValue')('value');

        wrapper.update();

        expect(wrapper.find(FakeComponent).prop('state')).toEqual({
            null: '#value#'
        });
    });

    it('should handle change for the text field', () => {
        const [wrapper] = init({ configuration: {} });

        expect(wrapper.find(FakeComponent).prop('state')).toEqual({});

        wrapper.find(TextField).prop('onChange')({
            target: { name: 'key_1', value: 'value_1' }
        });

        wrapper.update();

        expect(wrapper.find(FakeComponent).prop('state')).toEqual({
            key_1: 'value_1'
        });
    });

    it('should handle swap for the CDC stage', () => {
        const [wrapper, props] = init(
            {
                configuration: {
                    operation: CDC,
                    newDataset: 'newDataset',
                    oldDataset: 'oldDataset'
                }
            },
            true
        );

        expect(wrapper.find(FakeComponent).prop('state')).toEqual(
            props.configuration
        );

        wrapper.find(FakeComponent).prop('handleSwap')();

        wrapper.update();

        expect(wrapper.find(FakeComponent).prop('state')).toEqual({
            operation: CDC,
            newDataset: 'oldDataset',
            oldDataset: 'newDataset'
        });

        expect(props.swapEdges).toHaveBeenCalled();
    });

    it('should handle swap for the JOIN stage', () => {
        const [wrapper, props] = init(
            {
                configuration: {
                    operation: JOIN,
                    leftDataset: 'leftDataset',
                    rightDataset: 'rightDataset'
                }
            },
            true
        );

        expect(wrapper.find(FakeComponent).prop('state')).toEqual(
            props.configuration
        );

        wrapper.find(FakeComponent).prop('handleSwap')();

        wrapper.update();

        expect(wrapper.find(FakeComponent).prop('state')).toEqual({
            operation: JOIN,
            leftDataset: 'rightDataset',
            rightDataset: 'leftDataset'
        });

        expect(props.swapEdges).toHaveBeenCalled();
    });
});
