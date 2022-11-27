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
import { pipelinesStagesByType } from './pipelinesStages';

import UnitConfig from '../unitConfig';
import { set } from 'lodash';

jest.mock('../unitConfig', () => ({
    PIPELINE: {
        STAGES: {
            JOB: true,
            PIPELINE: true,
            CONTAINER: true,
            NOTIFICATION: true,
            WAIT: true
        }
    }
}));

describe('pipelinesStages', () => {
    const theme = {
        palette: {
            secondary: { light: '#F3EAFF' },
            info: { background: '0000', light: '0003' },
            success: { background: '0001' },
            warning: { background: '0002' }
        }
    };

    const expectedResult = {
        JOB: {
            operation: 'JOB',
            name: undefined,
            show: expect.any(Boolean),
            color: '#F3EAFF'
        },
        PIPELINE: {
            operation: 'PIPELINE',
            name: undefined,
            show: expect.any(Boolean),
            color: '0002'
        },
        CONTAINER: {
            operation: 'CONTAINER',
            name: undefined,
            show: expect.any(Boolean),
            color: '0000'
        },
        NOTIFICATION: {
            operation: 'NOTIFICATION',
            name: undefined,
            show: expect.any(Boolean),
            color: '0001'
        },
        WAIT: {
            operation: 'WAIT',
            name: undefined,
            show: expect.any(Boolean),
            color: '0003'
        }
    };

    it('pipelinesStagesByType should return correct result', () => {
        expect(pipelinesStagesByType(theme)).toEqual(expectedResult);
    });

    it('should hide stages based on the config', () => {
        Object.keys(UnitConfig.PIPELINE.STAGES).forEach(name =>
            set(UnitConfig.PIPELINE.STAGES, name, false)
        );

        expect(pipelinesStagesByType(theme)).toEqual({});
    });
});
