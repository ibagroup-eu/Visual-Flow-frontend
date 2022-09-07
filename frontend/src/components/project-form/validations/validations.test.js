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

import {
    isValidationPassed,
    isEmpty,
    isLimitsEmpty,
    isValidationLimitsPassed
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
});
