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
import { render } from 'enzyme';

import LogsModal from './LogsModal';
import PopupForm from '../../components/popup-form';
import Logs from './logs/Logs';

describe('LogsModal', () => {
    let wrapper;
    let props;

    beforeEach(() => {
        props = {
            projId: 'vsw-frontend',
            jobId: 'fcf5055a-e138-4e65-a2f1-581580c79dd9',
            modal: true,
            pipelineId: undefined,
            nodeId: undefined,
            onClose: jest.fn(),
            title: 'Logs'
        };

        wrapper = render(<LogsModal {...props} />);
    });

    it('should render without crashes', () => {
        expect(wrapper).toBeDefined();
    });

    it('should render Logs', () => {
        expect(wrapper.find(Logs)).toBeDefined();
    });

    it('should render PopupForm', () => {
        expect(wrapper.find(PopupForm)).toBeDefined();
    });
});
