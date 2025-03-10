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
import { mount, shallow } from 'enzyme';
import { Button } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import KafkaStorage, { fromState, toState } from './KafkaStorage';
import ReadTextFields from '../../../../components/rw-text-fields';
import PropertyListModal from '../../property-list/PropertyListModal';
import FileTextField from '../../../../components/file-text-field';
import { WRITE } from '../../../constants';

jest.mock('react-i18next', () => ({
    ...jest.requireActual('react-i18next'),
    useTranslation: jest.fn()
}));

describe('Kafka storage', () => {
    const init = (props = {}, returnProps = false, func = shallow) => {
        const defaultProps = {
            inputValues: {
                operation: 'operation',
                storage: 'kafka'
            },
            handleInputChange: jest.fn(),
            openModal: jest.fn(),
            ableToEdit: true,
            setState: jest.fn(),
            connection: {},
            uploadLocalFile: jest.fn().mockImplementation(() => Promise.resolve())
        };
        useTranslation.mockImplementation(() => ({ t: x => x }));
        const wrapper = func(<KafkaStorage {...defaultProps} {...props} />);
        return returnProps ? [wrapper, { ...defaultProps, ...props }] : [wrapper];
    };

    it('should render component', () => {
        const [wrapper] = init({});
        expect(wrapper).toBeDefined();
    });

    it('should call onClick prop', () => {
        const [wrapper] = init({});
        wrapper.find(Button).prop('onClick')();
        expect(wrapper.find(PropertyListModal).prop('open')).toBe(true);
    });

    it('should call handleSaveOptions', () => {
        const [wrapper, props] = init({}, true);
        wrapper.find(Button).prop('onClick')();
        wrapper.find(PropertyListModal).prop('onSave')([
            ['check.crcs', true],
            ['client.rack', 'test']
        ]);
        expect(props.setState).toHaveBeenCalled();
        expect(wrapper.find(PropertyListModal).exists()).toBeFalsy();
    });

    it('fromState should convert data', () => {
        const state = {
            'option.kafka.check.crcs': true,
            'option.kafka.client.rack': 'test',
            'option.kafka.ssl.truststore.location': 'cert.txt',
            subscribe: 'test',
            ssl: true
        };

        expect(fromState(state)).toEqual([
            ['check.crcs', true],
            ['client.rack', 'test']
        ]);
    });

    it('toState should convert data', () => {
        const state = [
            ['check.crcs', true],
            ['client.rack', 'test']
        ];

        expect(toState(state)).toEqual({
            'option.kafka.check.crcs': true,
            'option.kafka.client.rack': 'test'
        });
    });

    it('should calls uploadCertificate', async () => {
        const [wrapper, props] = init({}, true, mount);
        wrapper.find(FileTextField).invoke('setFile')({ name: 'testFile.jks' });
        expect(await props.handleInputChange).toHaveBeenCalled();
        expect(props.uploadLocalFile).toHaveBeenCalled();
    });

    it('should render ReadTextFields for WRITE', () => {
        const [wrapper] = init(
            {
                inputValues: {
                    operation: WRITE,
                    storage: 'kafka'
                }
            },
            true
        );

        const expectedFields = [{ field: 'topic' }];

        expect(
            wrapper
                .find(ReadTextFields)
                .at(0)
                .prop('fields')
        ).toEqual(expectedFields);
    });
});
