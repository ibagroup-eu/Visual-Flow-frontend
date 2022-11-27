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

import React from 'react';
import { shallow } from 'enzyme';
import { Button } from '@material-ui/core';
import DataframeModal from '../../../../components/dataframe-modal';
import DataframeStorage from './DataframeStorage';

describe('DataframeStorage', () => {
    let wrapper;
    let props;

    beforeEach(() => {
        props = {
            inputValues: {},
            handleInputChange: jest.fn(),
            ableToEdit: true
        };

        wrapper = shallow(<DataframeStorage {...props} />);
    });

    it('should render component', () => {
        expect(wrapper).toBeDefined();
    });

    it('should Button disabled with not ableToEdit && dataframe exist', () => {
        wrapper = shallow(
            <DataframeStorage
                {...props}
                ableToEdit={false}
                inputValues={{ data: 'object' }}
            />
        );
        expect(wrapper.find(Button).prop('disabled')).toBe(true);
    });

    it('should calls onClick prop', () => {
        wrapper.find(Button).prop('onClick')();
    });

    it('should calls onClose prop', () => {
        wrapper.find(DataframeModal).prop('onClose')();
    });
});
