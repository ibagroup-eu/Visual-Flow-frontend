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
import { mount } from 'enzyme';
import { useTranslation } from 'react-i18next';
import { Provider, useSelector } from 'react-redux';

import { TextField } from '@material-ui/core';

import Row from './Row';
import Arrows from '../../helpers/arrows';
import Actions from '../../helpers/actions';

jest.mock('react-i18next', () => ({
    ...jest.requireActual('react-i18next'),
    useTranslation: jest.fn()
}));

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn()
}));

describe('Scripts Schema Row', () => {
    afterEach(() => jest.clearAllMocks());

    const init = (
        props = {},
        returnProps = false,
        zones = ['us-east-1d'],
        func = mount
    ) => {
        const defaultProps = {
            source: 's3',
            onMoveTop: jest.fn(),
            onMoveDown: jest.fn(),
            onChange: jest.fn(),
            onRemove: jest.fn(),
            onAdd: jest.fn(),
            sources: {
                AWS: {
                    Workspace: 'workspace',
                    Volumes: 'volumes'
                    // S3: 's3'
                },
                GCP: {
                    Workspace: 'workspace',
                    Volumes: 'volumes',
                    GCS: 'gcs'
                },
                Azure: {
                    Workspace: 'workspace',
                    ABFSS: 'abfss'
                }
            },
            cloud: 'Azure'
        };
        useTranslation.mockImplementation(() => ({ t: x => x }));
        useSelector.mockImplementation(_ => zones);

        const wrapper = func(<Row {...defaultProps} {...props} />);

        return returnProps
            ? [
                  wrapper,
                  {
                      ...defaultProps,
                      ...props
                  }
              ]
            : [wrapper];
    };

    it('should render without crashes', () => {
        const [wrapper] = init();

        expect(wrapper.find(Arrows).length).toBe(1);
        expect(wrapper.find(TextField).length).toBe(2);
    });

    it('should have default value for shouldDisableDeleteBtn property', () => {
        const [wrapper] = init();
        expect(wrapper.find(Actions).prop('shouldDisableDeleteBtn')).toBe(false);
    });

    it('should not use default value for shouldDisableDeleteBtn property', () => {
        const [wrapper] = init({ shouldDisableDeleteBtn: true });
        expect(wrapper.find(Actions).prop('shouldDisableDeleteBtn')).toBe(true);
    });

    it('should show volumes error', () => {
        const [wrapper] = init({ volumesError: true });
        expect(wrapper.find(Actions).prop('shouldDisableDeleteBtn')).toBe(false);
    });

    it('should show s3 error', () => {
        const [wrapper] = init({ sThreeError: true });
        expect(wrapper.find(Actions).prop('shouldDisableDeleteBtn')).toBe(false);
    });
});
