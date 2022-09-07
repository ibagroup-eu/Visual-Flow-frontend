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

import { mount } from 'enzyme';
import React from 'react';
import redux from 'react-redux';
import withParams from './withParams';
import { setCurrentProject } from '../redux/actions/projectsActions';

const Test = ({ projectId, data }) => (
    <>
        {projectId}:{data}
    </>
);

describe('withParams', () => {
    const dispatch = jest.fn();

    beforeEach(() => {
        jest.spyOn(React, 'useEffect').mockImplementation(handle => handle());
        jest.spyOn(redux, 'useDispatch').mockReturnValue(dispatch);
    });

    it('should wrap component', () => {
        const Component = withParams(Test);
        const data = 'Data';
        const match = { params: { data } };
        const wrapper = mount(<Component match={match} data={data} />);

        expect(wrapper.text()).toBe(`:${data}`);
    });

    it('should dispatch setCurrentProject when matches projectId', () => {
        const Component = withParams(Test);
        const projectId = 'Id';
        const data = 'Data';
        const match = { params: { projectId } };
        const wrapper = mount(<Component match={match} data={data} />);
        expect(wrapper.find(Test)).toHaveLength(1);
        expect(dispatch).toHaveBeenCalledWith(setCurrentProject(projectId));
    });
});
