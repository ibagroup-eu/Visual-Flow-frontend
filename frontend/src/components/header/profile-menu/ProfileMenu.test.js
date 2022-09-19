import React from 'react';
import { shallow } from 'enzyme';
import { useTranslation } from 'react-i18next';
import ProfilePageModal from '../profile-page';
import ProfileMenu from './ProfileMenu';
import { MenuItem } from '@material-ui/core';

jest.mock('react-i18next', () => ({
    ...jest.requireActual('react-i18next'),
    useTranslation: jest.fn()
}));

describe('ProfileMenu', () => {
    const init = (props = {}, returnProps = false) => {
        const defaultProps = {
            anchorEl: 'test',
            open: true,
            handleClose: jest.fn()
        };
        useTranslation.mockImplementation(() => ({ t: x => x }));

        const wrapper = shallow(<ProfileMenu {...defaultProps} {...props} />);
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
});
