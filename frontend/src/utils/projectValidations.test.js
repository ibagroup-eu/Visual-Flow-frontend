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

import {
    isCorrectDescription,
    isCorrectHost,
    isCorrectName,
    isCorrectPath,
    isPositiveNumber
} from './projectValidations';

describe('Project Validations', () => {
    it('should return false for isCorrectName', () => {
        ['12', 'имя', 'This name length is more than 40 symbols.'].forEach(name =>
            expect(isCorrectName(name)).toBeFalsy()
        );
    });

    it('should return true for isCorrectName', () => {
        ['Name', 'Name 01', 'Name01', 'Name_01'].forEach(name =>
            expect(isCorrectName(name)).toBeTruthy()
        );
    });

    it('should return true for isCorrectDescription', () => {
        const description = 'Description';
        expect(isCorrectDescription(description)).toBeTruthy();
    });

    it('should return true for isPositiveNumber', () => {
        expect(isPositiveNumber(5)).toBeTruthy();
    });

    it('should return false for isPositiveNumber', () => {
        expect(isPositiveNumber(-5)).toBeFalsy();
    });

    it('should return true for isCorrectHost', () => {
        expect(
            isCorrectHost('https://adb-908482742969127.7.azuredatabricks.net')
        ).toBeTruthy();
    });

    it('should return false for isCorrectHost', () => {
        expect(isCorrectHost('a')).toBeFalsy();
    });

    it('should return true for isCorrectPath 1', () => {
        expect(isCorrectPath('/Volumes/catalog/schema/volume/path')).toBeTruthy();
    });

    it('should return true for isCorrectPath 2', () => {
        expect(isCorrectPath('/Volumes/catalog/schema/volume_path')).toBeTruthy();
    });

    it('should return true for isCorrectPath 3', () => {
        expect(
            isCorrectPath('/Volumes/catalog/schema1/schema2/schema3/volume_path')
        ).toBeTruthy();
    });

    it('should return false for isCorrectPath 1', () => {
        expect(isCorrectPath('ololo')).toBeFalsy();
    });

    it('should return false for isCorrectPath 2', () => {
        expect(isCorrectPath('/Volumes/catalog/schema')).toBeFalsy();
    });
});
