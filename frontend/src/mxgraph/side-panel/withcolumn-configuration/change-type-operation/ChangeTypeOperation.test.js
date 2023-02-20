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
import { shallow} from 'enzyme';
import ChangeTypeOperation from './index';
import SelectField from "../../../../components/select-field";

describe('ChangeTypeOperation', () => {
    let wrapper;
    let defaultProps;

    beforeEach(() => {
        defaultProps = {
            state: {
                'option.columnType': 'boolean'
            },
            ableToEdit: true,
            handleInputChange: jest.fn()
        };

        wrapper = shallow(<ChangeTypeOperation {...defaultProps} />);
    });

    it('should render component', () => {
        expect(wrapper).toBeDefined();
    });

    it('should render select field', () => {
        expect(wrapper.find(SelectField)).toHaveLength(1);
    });
});
