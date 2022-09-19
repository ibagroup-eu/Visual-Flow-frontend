import React from 'react';
import { shallow } from 'enzyme';
import EditDesignerButtons from './EditDesignerButtons';
import { IconButton, Tooltip } from '@material-ui/core';

describe('EditDesignerButtons', () => {
    const init = (props = {}, returnProps = false) => {
        const defaultProps = {
            setSidePanel: jest.fn(),
            sidePanelIsOpen: true,
            data: {},
            setDirty: jest.fn(),
            graph: {
                isEnabled: jest.fn(() => true),
                getSelectionCells: jest.fn(() => []),
                removeCells: jest.fn(),
                popupMenuHandler: { hideMenu: jest.fn() }
            },
            reversible: { undo: jest.fn(), redo: jest.fn() },
            refresh: jest.fn(),
            editable: true,
            t: jest.fn(),
            undoButtonsDisabling: {},
            setCurrentCell: jest.fn(),
            type: 'test'
        };

        const wrapper = shallow(
            <EditDesignerButtons {...defaultProps} {...props} />
        );
        return returnProps ? [wrapper, { ...defaultProps, ...props }] : [wrapper];
    };

    it('should render without crashes', () => {
        const [wrapper] = init();
        expect(wrapper.find(IconButton).exists()).toBeTruthy();
        expect(wrapper.find(Tooltip).exists()).toBeTruthy();
    });

    it('should call reversible undo func', () => {
        const [wrapper] = init({});
        wrapper
            .find(IconButton)
            .at(0)
            .prop('onClick')();
    });

    it('should call reversible redo func', () => {
        const [wrapper] = init({});
        wrapper
            .find(IconButton)
            .at(1)
            .prop('onClick')();
    });

    it('should call setSidePanel prop with false', () => {
        const [wrapper, props] = init({}, true);
        wrapper
            .find(IconButton)
            .at(2)
            .simulate('click');
        expect(props.setSidePanel).toHaveBeenCalledWith(false);
    });

    it('should not call setSidePanel prop', () => {
        const [wrapper, props] = init(
            {
                graph: {
                    isEnabled: jest.fn()
                }
            },
            true
        );
        wrapper
            .find(IconButton)
            .at(2)
            .simulate('click');
        expect(props.setSidePanel).not.toHaveBeenCalled();
    });

    it('should call setCurrentCell prop', () => {
        const [wrapper, props] = init({ type: 'PIPELINE' }, true);
        wrapper
            .find(IconButton)
            .at(2)
            .simulate('click');
        expect(props.setCurrentCell).toHaveBeenCalledWith('');
    });

    it('should call setDirty prop with true', () => {
        const [wrapper, props] = init(
            {
                graph: {
                    isEnabled: jest.fn(() => true),
                    getSelectionCells: jest.fn(() => [1, 2, 3]),
                    removeCells: jest.fn(),
                    popupMenuHandler: { hideMenu: jest.fn() }
                }
            },
            true
        );
        wrapper
            .find(IconButton)
            .at(2)
            .simulate('click');
        expect(props.setDirty).toHaveBeenCalledWith(true);
    });
});
