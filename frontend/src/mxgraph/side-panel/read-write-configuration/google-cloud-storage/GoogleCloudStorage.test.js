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
import { shallow } from 'enzyme';
import { useTranslation } from 'react-i18next';
import { READ, WRITE } from '../../../constants';
import GoogleCloudStorage from '.';
import FileTextField from '../../../../components/file-text-field';
import ReadWriteTextFields from '../../../../components/rw-text-fields';
import FileFormatProperties from '../file-format-properties';
import WriteMode from '../helpers/WriteMode';
import AutocompleteParameter from '../../autocomplete-parameter';

jest.mock('react-i18next', () => ({
    ...jest.requireActual('react-i18next'),
    useTranslation: jest.fn()
}));

jest.mock('uuid', () => ({
    ...jest.requireActual('uuid'),
    v4: () => 'test-id'
}));

describe('GoogleCloudStorage', () => {
    const init = (props = {}) => {
        const defaultProps = {
            inputValues: {},
            ableToEdit: true,
            connectionPage: false,
            currentProject: 'test-prj'
        };

        useTranslation.mockImplementation(() => ({ t: x => x }));

        return shallow(<GoogleCloudStorage {...defaultProps} {...props} />);
    };

    it('should render form for the connections page', async () => {
        const fileName = 'test_file.json';
        const handleInputChange = jest.fn();
        const uploadLocalFile = jest
            .fn()
            .mockImplementation(() => Promise.resolve());
        const wrapper = init({
            connectionPage: true,
            handleInputChange,
            uploadLocalFile
        });
        const fileUploader = wrapper.find(FileTextField);

        expect(fileUploader.prop('ableToEdit')).toEqual(true);
        expect(fileUploader.prop('value')).toEqual(undefined);
        expect(fileUploader.prop('label')).toEqual(
            'jobDesigner:readConfiguration.pathToKeyFile'
        );

        fileUploader.invoke('setFile')({ name: fileName });
        expect(uploadLocalFile).toHaveBeenCalled();
        expect(await handleInputChange).toHaveBeenCalledWith({
            target: {
                name: 'pathToKeyFile',
                value: `/files/test-prj/test-id/${fileName}`
            }
        });
    });

    it('should not call uploadLocalFile (not valid extension)', async () => {
        const fileName = 'test_file.';
        const handleInputChange = jest.fn();
        const uploadLocalFile = jest
            .fn()
            .mockImplementation(() => Promise.resolve());
        const wrapper = init({
            connectionPage: true,
            handleInputChange,
            uploadLocalFile
        });
        const fileUploader = wrapper.find(FileTextField);

        fileUploader.invoke('setFile')({ name: fileName });
        expect(uploadLocalFile).not.toHaveBeenCalled();
    });

    it('should render form in read mode', () => {
        const pathToKeyFile = '/files/test-prj/test-id/test_file.json';
        const wrapper = init({
            connection: { pathToKeyFile },
            inputValues: { pathToKeyFile, operation: READ }
        });
        const fileUploader = wrapper.find(FileTextField);

        expect(fileUploader.prop('ableToEdit')).toEqual(false);
        expect(fileUploader.prop('value')).toEqual('test_file.json');
        expect(wrapper.find(ReadWriteTextFields).prop('fields')).toEqual([
            { field: 'bucket' },
            { field: 'path' }
        ]);
        expect(wrapper.find(FileFormatProperties).length).toEqual(1);
    });

    it('should render form in write mode', () => {
        const wrapper = init({
            inputValues: { operation: WRITE }
        });

        expect(wrapper.find(WriteMode).length).toEqual(1);
        expect(wrapper.find(AutocompleteParameter).prop('name')).toEqual(
            'partitionBy'
        );
    });
});
