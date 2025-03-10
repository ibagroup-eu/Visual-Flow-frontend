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

import { DATABRICKS } from '../../../mxgraph/constants';
import {
    isValidationPassed,
    isEmpty,
    isLimitsEmpty,
    isValidationLimitsPassed,
    isValidationDemoLimitsPassed,
    isLimitsAndDemoLimitsValidationsPassed,
    isDatabricksValidationPassed
} from './validations';

describe('Project Validations', () => {
    const emptyLimits = {
        limitsCpu: '',
        limitsMemory: '',
        requestsCpu: '',
        requestsMemory: ''
    };

    const validLimits = {
        limitsCpu: '2',
        limitsMemory: '2',
        requestsCpu: '1',
        requestsMemory: '1'
    };

    const invalidLimits = {
        limitsCpu: '-1',
        limitsMemory: '-2',
        requestsCpu: '-3',
        requestsMemory: '-4'
    };

    const tomorrow = new Date(Date.now() + 86400000);
    const validDemoLimits = {
        jobsNumAllowed: '2',
        pipelinesNumAllowed: '2',
        expirationDate: tomorrow.toISOString().split('T')[0]
    };

    const invalidDemoLimits = {
        jobsNumAllowed: '-1',
        pipelinesNumAllowed: '-2',
        expirationDate: '0000-23-32'
    };

    it('should return true for isLimitsEmpty', () => {
        expect(isLimitsEmpty(emptyLimits)).toBeTruthy();
    });

    it('should return false for isLimitsEmpty', () => {
        expect(isLimitsEmpty(validLimits)).toBeFalsy();
    });

    it('should return true for isValidationLimitsPassed', () => {
        expect(isValidationLimitsPassed(validLimits)).toBeTruthy();
    });

    it('should return false for isValidationLimitsPassed', () => {
        expect(isValidationLimitsPassed(invalidLimits)).toBeFalsy();
    });

    it('should return true for isValidationDemoLimitsPassed', () => {
        expect(isValidationDemoLimitsPassed(validDemoLimits)).toBeTruthy();
    });

    it('should return false for isValidationDemoLimitsPassed', () => {
        expect(isValidationDemoLimitsPassed(invalidDemoLimits)).toBeFalsy();
    });

    it('should return true for isEmpty', () => {
        expect(isEmpty({ name: '', limits: emptyLimits })).toBeTruthy();
    });

    it('should return false for isEmpty', () => {
        expect(isEmpty({ name: 'name', limits: validLimits })).toBeFalsy();
    });

    it('should return false for isValidationPassed', () => {
        expect(
            isValidationPassed({ name: '--', description: '', limits: emptyLimits })
        ).toBeFalsy();
    });

    it('should return true for isValidationPassed', () => {
        expect(
            isValidationPassed({
                name: 'name',
                description: '',
                limits: validLimits
            })
        ).toBeTruthy();
    });

    it('should return true for isLimitAndDemoLimitsValidationsPassed 1', () => {
        expect(
            isLimitsAndDemoLimitsValidationsPassed({
                name: 'name',
                description: '',
                limits: validLimits,
                demo: true,
                demoLimits: validDemoLimits
            })
        ).toBeTruthy();
    });

    it('should return true for isLimitAndDemoLimitsValidationsPassed 2', () => {
        expect(
            isLimitsAndDemoLimitsValidationsPassed({
                name: 'name',
                description: '',
                limits: validLimits,
                demo: false,
                demoLimits: validDemoLimits
            })
        ).toBeTruthy();
    });

    it('should return false for isDatabricksValidationPassed', () => {
        Object.defineProperty(window, 'PLATFORM', {
            value: DATABRICKS
        });
        expect(
            isDatabricksValidationPassed({
                host: 'a',
                authentication: {
                    token: 't',
                    clientId: 'clientId',
                    secret: 'secret',
                    authenticationType: 'PAT'
                },
                pathToFile: 'a'
            })
        ).toBeFalsy();
    });

    it('should return true for isDatabricksValidationPassed', () => {
        expect(
            isDatabricksValidationPassed({
                host: 'https://adb-908482742969127.7.azuredatabricks.net',
                authentication: {
                    token: 'token',
                    clientId: 'clientId',
                    secret: 'secret',
                    authenticationType: 'PAT'
                },
                pathToFile: '/Volumes/sales/dims/jars/vf240729'
            })
        ).toBeTruthy();
    });
});
