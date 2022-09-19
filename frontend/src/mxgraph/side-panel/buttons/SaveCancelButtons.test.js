import React from 'react';
import { shallow } from 'enzyme';
import SaveCancelButtons from './SaveCancelButtons';
import { useTranslation } from 'react-i18next';
import { Button } from '@material-ui/core';

jest.mock('react-i18next', () => ({
    ...jest.requireActual('react-i18next'),
    useTranslation: jest.fn()
}));

describe('SaveCancelButtons', () => {
    const init = (props = {}, returnProps = false, func = shallow) => {
        const defaultProps = {
            ableToEdit: true,
            saveCell: jest.fn(),
            isDisabled: false,
            closeSidePanel: jest.fn(),
            cancelChanges: jest.fn(),
            sidePanelIsDirty: true,
            confirmationWindow: jest.fn()
        };
        useTranslation.mockImplementation(() => ({ t: x => x }));

        const wrapper = func(<SaveCancelButtons {...defaultProps} {...props} />);
        return returnProps ? [wrapper, { ...defaultProps, ...props }] : [wrapper];
    };

    afterEach(() => useTranslation.mockClear());

    it('should render without crashes', () => {
        const [wrapper] = init();
        expect(wrapper).toBeDefined();
    });

    it('should run confirmationWindow func when discard button cklicked', () => {
        const [wrapper, props] = init({}, true);
        const button = wrapper.find(Button);
        button.at(1).simulate('click');
        expect(props.confirmationWindow).toHaveBeenCalled();
    });

    it('should not run confirmationWindow func', () => {
        const [wrapper, props] = init(
            { sidePanelIsDirty: false, isModal: false },
            true
        );
        const button = wrapper.find(Button);
        button.at(1).simulate('click');
        expect(props.confirmationWindow).not.toHaveBeenCalled();
        expect(props.cancelChanges).toHaveBeenCalled();
        expect(props.closeSidePanel).toHaveBeenCalledWith(false);
    });

    it('should cancel changes when a callback is called', () => {
        const [wrapper, props] = init({ isModal: false }, true);

        const button = wrapper.find(Button);
        button.at(1).simulate('click');

        expect(props.confirmationWindow).toHaveBeenCalled();

        const callback = props.confirmationWindow.mock.calls[0][0].callback;

        callback();

        expect(props.closeSidePanel).toHaveBeenCalledWith(false);
        expect(props.cancelChanges).toHaveBeenCalled();
    });
});
