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

import { Box, Button, Popover, TextField } from '@material-ui/core';
import { shallow } from 'enzyme';
import React from 'react';
import DataframeColumnsButton from './DataframeColumnsButton';

describe('DataframeColumnsButton', () => {
    let wrapper;
    let props;

    beforeEach(() => {
        props = {
            columns: [
                { column: 'testwithverybigname', type: 'String' },
                { column: 'test2', type: 'String' },
                { column: 'test3', type: 'String' }
            ],
            invisibled: [],
            setInvisibled: jest.fn(),
            setPage: jest.fn()
        };

        wrapper = shallow(<DataframeColumnsButton {...props} />);
    });

    it('should render component', () => {
        expect(wrapper).toBeDefined();
    });

    it('should calls onClick prop for columns Button', () => {
        wrapper
            .find(Button)
            .at(0)
            .prop('onClick')({
            currentTarget: {}
        });
    });

    it('should calls onClose prop for Popover', () => {
        wrapper.find(Popover).prop('onClose')();
    });

    it('should calls onChange prop for TextField', () => {
        wrapper.find(TextField).prop('onChange')({ target: { value: 'test' } });
    });

    it('should navigate to first page', () => {
        wrapper = shallow(
            <DataframeColumnsButton {...props} invisibled={['test2', 'test3']} />
        );
        wrapper
            .find(Box)
            .at(2)
            .prop('onClick')();
    });

    it('should calls onClick prop for hideAll', () => {
        wrapper
            .find(Button)
            .at(1)
            .prop('onClick')();
    });

    it('should calls onClick prop for showAll', () => {
        wrapper
            .find(Button)
            .at(2)
            .prop('onClick')();
    });

    it('should calls onClick prop for switch box with visibledIndex === -1', () => {
        wrapper
            .find(Box)
            .at(2)
            .prop('onClick')();
    });

    it('should calls onClick prop for switch box with visibledIndex === 0', () => {
        wrapper = shallow(
            <DataframeColumnsButton
                {...props}
                invisibled={['testwithverybigname']}
            />
        );
        wrapper
            .find(Box)
            .at(2)
            .prop('onClick')();
    });

    it('should calls onClick prop for switch box with visibledIndex === invisibled.length - 1', () => {
        wrapper = shallow(
            <DataframeColumnsButton
                {...props}
                invisibled={['testwithverybigname', 'test2']}
            />
        );
        wrapper
            .find(Box)
            .at(3)
            .prop('onClick')();
    });

    it('should calls onClick prop for switch box with visibledIndex > 0', () => {
        wrapper = shallow(
            <DataframeColumnsButton
                {...props}
                invisibled={['testwithverybigname', 'test2', 'test3']}
            />
        );
        wrapper
            .find(Box)
            .at(3)
            .prop('onClick')();
    });
});
