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

import JobsPipelines from './JobsPipelines';
import { Grid } from '@material-ui/core';

describe('JobsPipelines', () => {
    const init = (props = {}) => {
        const defaultProps = {
            items: [{ title: 'title' }, {}],
            loading: false,
            title: '',
            setStatus: jest.fn(),
            setCurrentPage: jest.fn()
        };

        return [
            shallow(<JobsPipelines {...defaultProps} {...props} />),
            { ...defaultProps, ...props }
        ];
    };

    it('should render without crashes', () => {
        const [wrapper, _] = init();

        expect(wrapper).toBeDefined();
    });

    it('should render all items', () => {
        const [wrapper, props] = init();

        expect(wrapper.find(Grid).length).toBe(props.items.length);
    });

    it('should handle a grid click', () => {
        const [wrapper, props] = init();

        const row = wrapper
            .find(Grid)
            .at(0)
            .find('div[onClick]');

        row.simulate('click');

        expect(props.setStatus).toHaveBeenCalledWith(props.items[0].title);
        expect(props.setCurrentPage).toHaveBeenCalledWith(0);
    });
});
