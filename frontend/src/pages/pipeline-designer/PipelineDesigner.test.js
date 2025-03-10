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

import { mount, shallow } from 'enzyme';
import React from 'react';
import { PageSkeleton } from '../../components/skeleton';
import GraphDesigner from '../../mxgraph';
import { PipelineDesigner } from './PipelineDesigner';

describe('PipelineDesigner', () => {
    let wrapper;
    let props;

    beforeEach(() => {
        props = {
            pipelineId: undefined,
            loading: true,
            getPipeline: jest.fn(),
            createFields: jest.fn(),
            getParameters: jest.fn(),
            getJobs: jest.fn(),
            getPipelines: jest.fn(),
            getUsers: jest.fn(),
            t: jest.fn()
        };

        wrapper = shallow(<PipelineDesigner {...props} />);
    });

    it('should render component', () => {
        expect(wrapper).toBeDefined();
    });

    it('should render PageSkeleton', () => {
        wrapper.setProps({ loading: true });
        expect(wrapper.find(PageSkeleton)).toHaveLength(1);
    });

    it('should render GraphDesigner', () => {
        wrapper.setProps({ loading: false });
        expect(wrapper.find(GraphDesigner)).toHaveLength(1);
    });

    it('should calls useEffect with projectId and pipelineId', () => {
        wrapper = mount(<PipelineDesigner {...props} />);

        wrapper.setProps({ projectId: 'newVswId', pipelineId: 'newPlnId' });

        expect(props.getPipeline).toBeCalledWith(
            'newVswId',
            'newPlnId',
            expect.any(Function)
        );
        expect(props.getParameters).toBeCalledWith('newVswId');
        expect(props.getJobs).toBeCalledWith('newVswId');
        expect(props.getPipelines).toBeCalledWith('newVswId');
        expect(props.getUsers).toHaveBeenCalled();
    });

    it('should call isValidName with diff params', () => {
        const calls = [];

        const createFields = x => calls.push(x);
        const t = x => x;

        mount(<PipelineDesigner {...props} createFields={createFields} t={t} />);

        const { validate } = calls[0].NAME;

        expect(validate('')).toBe('main:validation.notBlank');

        expect(validate('01')).toBe('main:validation.incorrectPipelineLength');

        expect(validate('------')).toBe('main:validation.incorrectCharacters');

        expect(validate('abc')).toBeNull();
    });
});
