/*
 * Copyright (c) 2021 IBA Group, a.s. All rights reserved.
 *
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react';
import { mount } from 'enzyme';
import { Menu } from '@material-ui/core';
import LangMenu from './LangMenu';

const mockChangeLang = jest.fn(() => new Promise(() => {}));
jest.mock('react-i18next', () => ({
    // this mock makes sure any components using the translate hook can use it without a warning being shown
    useTranslation: () => {
        return {
            t: str => str,
            i18n: {
                changeLanguage: mockChangeLang
            }
        };
    }
}));

describe('LangMenu', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = mount(<LangMenu />);
    });

    it('should render without crashes', () => {
        expect(wrapper.find(Menu).exists()).toBeTruthy();
    });

    it('should call "onClick"', () => {
        const useStateSpy = jest.spyOn(React, 'useState');
        wrapper.find('[id="curr-lang"]').simulate('click');
        expect(useStateSpy).toHaveBeenCalled();
    });

    it('should call "onMenuItemClick"', () => {
        wrapper
            .find('[id="lang-menu-item-en"]')
            .hostNodes()
            .simulate('click');
        expect(mockChangeLang).toHaveBeenCalledWith('en');
    });

    it('should call "onClose"', () => {
        const useStateSpy = jest.spyOn(React, 'useState');
        wrapper.find(Menu).prop('onClose')();
        expect(useStateSpy).toHaveBeenCalled();
    });
});
