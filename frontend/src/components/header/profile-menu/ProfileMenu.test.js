import React from 'react';
import { mount, shallow } from 'enzyme';
import { useTranslation } from 'react-i18next';
import ProfilePageModal from '../profile-page';
import { ProfileMenu } from './ProfileMenu';
import { MenuItem } from '@material-ui/core';
import { LocalOffer } from '@material-ui/icons';
import api from '../../../api/auth';

jest.mock('react-i18next', () => ({
    ...jest.requireActual('react-i18next'),
    useTranslation: jest.fn()
}));

describe('ProfileMenu', () => {
    const init = (props = {}, returnProps = false, func = shallow) => {
        const defaultProps = {
            anchorEl: 'test',
            open: true,
            handleClose: jest.fn(),
            getVersion: jest.fn()
        };
        useTranslation.mockImplementation(() => ({ t: x => x }));

        const wrapper = func(<ProfileMenu {...defaultProps} {...props} />);
        return returnProps ? [wrapper, { ...defaultProps, ...props }] : [wrapper];
    };

    afterEach(() => useTranslation.mockClear());

    it('should render without crashes', () => {
        const [wrapper] = init();
        expect(wrapper).toBeDefined();
    });

    it('should call handleCloseProfilePage func', () => {
        const [wrapper] = init();
        wrapper.find(ProfilePageModal).prop('onClose')();
    });

    it('should call  handleClose prop', () => {
        const [wrapper, props] = init({}, true);
        wrapper
            .find(MenuItem)
            .at(0)
            .prop('onClick')();
        expect(props.handleClose).toHaveBeenCalled();
    });

    it('should call logout', () => {
        const spy = jest.spyOn(api, 'logout');
        const [wrapper] = init();
        wrapper
            .find(MenuItem)
            .at(1)
            .prop('onClick')();

        expect(spy).toHaveBeenCalled();
    });

    it('should show version', () => {
        const [wrapper] = init({ version: '1.0.0' });

        expect(wrapper.find(LocalOffer).exists()).toBeTruthy();
        expect(
            wrapper
                .find(MenuItem)
                .at(2)
                .text()
        ).toBe('Version: 1.0.0');
    });

    it('should not show version', () => {
        const [wrapper] = init();

        expect(wrapper.find(LocalOffer).exists()).toBeFalsy();
    });

    it('should handle useEffect', () => {
        const [_, props] = init({}, true, mount);

        expect(props.getVersion).toHaveBeenCalled();
    });
});
