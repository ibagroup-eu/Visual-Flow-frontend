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

import { Box, Grid } from '@material-ui/core';
import { mount, shallow } from 'enzyme';
import { times } from 'lodash';
import React from 'react';
import { Prompt } from 'react-router';
import FormWrapper from '../../../components/form-wrapper';
import PropertySelect from '../../../components/property-select';
import SearchInput from '../../../components/search-input';
import { PageSkeleton } from '../../../components/skeleton';
import ParametersTableRow from '../components/parameters-table-row';
import Parameters from './Parameters';

describe('Parameters', () => {
    let wrapper;
    let props;

    beforeEach(() => {
        props = {
            project: {},
            loading: true,
            getProject: jest.fn(),
            parameters: { editable: false },
            getParameters: jest.fn(),
            update: jest.fn()
        };

        wrapper = shallow(<Parameters {...props} />);
    });

    it('should render component', () => {
        expect(wrapper).toBeDefined();
    });

    it('should render PageSkeleton', () => {
        expect(wrapper.find(PageSkeleton)).toHaveLength(1);
    });

    it('should render 4 Grid and FormWrapper', () => {
        wrapper.setProps({ loading: false });
        expect(wrapper.find(Grid)).toHaveLength(4);
        expect(wrapper.find(FormWrapper)).toHaveLength(1);
    });

    it('should calls useEffect with projectId', () => {
        wrapper = mount(<Parameters {...props} />);
        wrapper.setProps({ projectId: 'newVswId' });
        expect(props.getParameters).toBeCalledWith('newVswId');
    });

    it('should render 10 ParametersTableRow and 2 Box', () => {
        const changedProps = {
            loading: false,
            parameters: {
                params: [],
                editable: true
            }
        };
        times(10, num =>
            changedProps.parameters.params.push({
                id: `id${num}`,
                key: `${num === 2 ? num + 1 : num}`,
                value: `2${num === 5 ? num + 1 : num}`
            })
        );
        wrapper = shallow(<Parameters {...props} {...changedProps} />);
        wrapper.find(FormWrapper).invoke('setEditMode')();
        expect(wrapper.find(ParametersTableRow)).toHaveLength(10);
        expect(wrapper.find(Box)).toHaveLength(3);
    });

    it('should calls isErrorParameter prop with add and delete id for errorParameters', () => {
        const changedProps = {
            loading: false,
            parameters: {
                params: [{ id: 'id1', key: '1', value: '21' }],
                editable: true
            }
        };
        wrapper = shallow(<Parameters {...props} {...changedProps} />);
        wrapper
            .find(ParametersTableRow)
            .at(0)
            .invoke('isErrorParameter')(true, 'id1');
        wrapper
            .find(ParametersTableRow)
            .at(0)
            .invoke('isErrorParameter')(false, 'id1');
    });

    it('should calls setEditMode prop', () => {
        const changedProps = {
            loading: false,
            parameters: {
                params: [{ id: 'id', key: '1', value: '21' }],
                editable: true
            }
        };
        wrapper = shallow(<Parameters {...props} {...changedProps} />);
        wrapper.find(FormWrapper).invoke('setEditMode')();
    });

    it('should calls onChange prop', () => {
        const changedProps = {
            loading: false,
            parameters: {
                params: [{ id: 'id', key: '1', value: '21' }],
                editable: true
            }
        };
        wrapper = shallow(<Parameters {...props} {...changedProps} />);
        wrapper.find(SearchInput).invoke('onChange')({ target: { value: 'test' } });
    });

    it('should calls onCancel prop', () => {
        const changedProps = {
            loading: false
        };
        wrapper = shallow(<Parameters {...props} {...changedProps} />);
        wrapper.find(FormWrapper).invoke('onCancel')();
    });

    it('should calls onSubmit prop', () => {
        const changedProps = {
            loading: false,
            projectId: 'newVswId',
            parameters: {
                params: [{ id: 'id', key: '1', value: '21' }],
                editable: true
            }
        };
        wrapper = shallow(<Parameters {...props} {...changedProps} />);
        wrapper.find(FormWrapper).invoke('onSubmit')();
        expect(props.update).toBeCalledWith('newVswId', {
            params: [{ key: '1', value: '21' }],
            editable: true
        });
    });

    it('should calls handleRemoveParameter and handleChange props', () => {
        const changedProps = {
            loading: false,
            parameters: {
                params: [{ id: 'id1', key: '1', value: '21' }],
                editable: true
            }
        };
        wrapper = shallow(<Parameters {...props} {...changedProps} />);
        wrapper.find(ParametersTableRow).invoke('handleChangeParameter')(
            {
                persist: jest.fn(),
                target: { value: 'testValue' }
            },
            'id1',
            'value'
        );
        wrapper.find(ParametersTableRow).invoke('handleRemoveParameter')('id');
        wrapper.find(PropertySelect).invoke('handleChange')({
            target: { value: 'test' }
        });
    });
});
