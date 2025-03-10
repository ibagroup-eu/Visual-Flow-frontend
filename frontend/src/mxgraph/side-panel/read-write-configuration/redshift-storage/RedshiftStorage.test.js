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
import { READ, WRITE } from '../../../constants';
import ReadTextFields from '../../../../components/rw-text-fields';
import ReadWriteEditorField from '../../../../components/rw-editor-field';
import WriteMode from '../helpers/WriteMode';
import RedshiftStorage from './RedshiftStorage';

describe('RedshiftStorage', () => {
    let wrapper;
    let props;

    beforeEach(() => {
        props = {
            inputValues: {},
            handleInputChange: jest.fn(),
            ableToEdit: true,
            openModal: jest.fn(),
            connectionPage: false,
            connection: {}
        };

        wrapper = shallow(<RedshiftStorage {...props} />);
    });

    it('should render component', () => {
        expect(wrapper).toBeDefined();
    });

    it('should render component with READ operation', () => {
        const changedProps = {
            inputValues: { operation: READ, customSql: 'true' }
        };
        wrapper = shallow(<RedshiftStorage {...props} {...changedProps} />);
        expect(wrapper.find(ReadTextFields)).toHaveLength(5);
        expect(wrapper.find(ReadWriteEditorField)).toHaveLength(1);
    });

    it('should render component with WRITE operation', () => {
        const changedProps = {
            inputValues: { operation: WRITE }
        };
        wrapper = shallow(<RedshiftStorage {...props} {...changedProps} />);
        expect(wrapper.find(ReadTextFields)).toHaveLength(6);
        expect(wrapper.find(WriteMode)).toHaveLength(1);
    });
});
