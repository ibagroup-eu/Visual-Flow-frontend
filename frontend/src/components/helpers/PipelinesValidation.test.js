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

import React from 'react';
import { findParamByKey, validParamsContainer } from './PipelinesValidation';

describe('PipelinesValidation', () => {
    describe('findParamByKey', () => {
        it('should return "false"', () => {
            expect(findParamByKey([], [undefined])).toBeFalsy();
        });

        it('should return "true"', () => {
            const values = ['#VALUE_1#', '#VALUE_2#'];
            const objects = [{ key: 'VALUE_1' }, { key: 'VALUE_2' }];

            expect(findParamByKey(objects, values)).toBeTruthy();
            expect(findParamByKey(objects, ['VALUE_1'])).toBeTruthy();
        });
    });

    describe('validParamsContainer', () => {
        it('should return "true"', () => {
            expect(
                validParamsContainer([{ key: 'VALUE_1' }, { key: 'VALUE_2' }], {
                    image: 'VALUE_2'
                })
            ).toBeTruthy();
        });

        it('should return "false"', () => {
            expect(
                validParamsContainer([{ key: 'VALUE_1' }, { key: 'VALUE_2' }], {})
            ).toBeFalsy();

            expect(
                validParamsContainer([{ key: 'VALUE_1' }, { key: 'VALUE_2' }], {
                    image: 'VALUE_2',
                    imagePullSecretType: 'PROVIDED'
                })
            ).toBeFalsy();
        });
    });
});
