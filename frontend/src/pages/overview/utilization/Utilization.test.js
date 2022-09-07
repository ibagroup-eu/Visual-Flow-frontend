/*
 *  Copyright (c) 2021 IBA Group, a.s. All rights reserved.
 *
 *  Licensed to the Apache Software Foundation (ASF) under one or more
 *  contributor license agreements.  See the NOTICE file distributed with
 *  this work for additional information regarding copyright ownership.
 *  The ASF licenses this file to You under the Apache License, Version 2.0
 *  (the "License"); you may not use this file except in compliance with
 *  the License.  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import { shallow } from 'enzyme';
import React from 'react';
import Utilization from './Utilization';
import { I18nextProvider } from 'react-i18next';
import { Grid } from '@material-ui/core';
import i18n from '../../../i18n';

describe('Utilization', () => {
    const init = (props = {}) => {
        const defaultProps = {
            data: {},
            loading: false
        };

        return shallow(
            <I18nextProvider i18n={i18n}>
                <Utilization {...defaultProps} {...props} />
            </I18nextProvider>
        )
            .dive()
            .dive();
    };

    it('should render without crashes', () => {
        const wrapper = init();

        expect(wrapper).toBeDefined();
    });

    it('should have 3 items', () => {
        const wrapper = init();

        expect(wrapper.find(Grid).length).toBe(3);
    });
});
