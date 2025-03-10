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
import FileFormat from '../helpers/FileFormat';
import FileFormatProperties from './FileFormatProperties';
import FileFormatDelta from './file-format-delta';
import FileFormatCSV from './file-format-csv';
import FileFormatAvro from './file-format-avro';
import FileFormatParquetOrc from './file-format-parquet-orc';
import FileFormatJSON from './file-format-json';
import FileFormatText from './file-format-text';
import FileFormatBinary from './file-format-binary';

describe('File Format Properties', () => {
    let wrapper;
    const defaultProps = {
        inputValues: {
            format: 'csv',
            operation: 'operation',
            header: 'header',
            delimiter: 'delimeter',
            useSchema: 'true'
        },
        handleInputChange: jest.fn(),
        ableToEdit: true
    };

    beforeEach(() => {
        wrapper = shallow(<FileFormatProperties {...defaultProps} />);
    });

    it('should render component', () => {
        expect(wrapper).toBeDefined();
    });

    it('should render empty FileFormat', () => {
        wrapper.setProps({
            inputValues: {
                objectType: 'volume'
            }
        });
        expect(wrapper.find(FileFormat).prop('value')).toEqual('');
    });

    it('should render the Delta file format', () => {
        wrapper.setProps({
            inputValues: {
                objectType: 'volume',
                format: 'delta'
            }
        });

        expect(wrapper.find(FileFormat).prop('value')).toEqual('delta');
        expect(wrapper.find(FileFormatDelta).length).toEqual(1);
    });

    it('should render the CSV file format', () => {
        wrapper.setProps({
            inputValues: {
                objectType: 'volume',
                format: 'csv'
            }
        });

        expect(wrapper.find(FileFormat).prop('value')).toEqual('csv');
        expect(wrapper.find(FileFormatCSV).length).toEqual(1);
    });

    it('should render the Avro file format', () => {
        wrapper.setProps({
            inputValues: {
                objectType: 'volume',
                format: 'avro'
            }
        });

        expect(wrapper.find(FileFormat).prop('value')).toEqual('avro');
        expect(wrapper.find(FileFormatAvro).length).toEqual(1);
    });

    it('should render the Parquet file format', () => {
        wrapper.setProps({
            inputValues: {
                objectType: 'volume',
                format: 'parquet'
            }
        });

        expect(wrapper.find(FileFormat).prop('value')).toEqual('parquet');
        expect(wrapper.find(FileFormatParquetOrc).length).toEqual(1);
    });

    it('should render the ORC file format', () => {
        wrapper.setProps({
            inputValues: {
                objectType: 'volume',
                format: 'orc'
            }
        });

        expect(wrapper.find(FileFormat).prop('value')).toEqual('orc');
        expect(wrapper.find(FileFormatParquetOrc).length).toEqual(1);
    });

    it('should render the JSON file format', () => {
        wrapper.setProps({
            inputValues: {
                objectType: 'volume',
                format: 'json'
            }
        });

        expect(wrapper.find(FileFormat).prop('value')).toEqual('json');
        expect(wrapper.find(FileFormatJSON).length).toEqual(1);
    });

    it('should render the Text file format', () => {
        wrapper.setProps({
            inputValues: {
                objectType: 'volume',
                format: 'text'
            }
        });

        expect(wrapper.find(FileFormat).prop('value')).toEqual('text');
        expect(wrapper.find(FileFormatText).length).toEqual(1);
    });

    it('should trigger handleInputChange from the Delta format component', () => {
        const value = 'test value';
        wrapper.setProps({
            inputValues: {
                objectType: 'volume',
                format: 'delta'
            }
        });

        wrapper.find(FileFormatDelta).prop('handleInputChange')(value);
        expect(defaultProps.handleInputChange).toHaveBeenCalledWith(value);
    });

    it('should render the binary file format', () => {
        wrapper.setProps({
            inputValues: {
                objectType: 'volume',
                format: 'binaryFile'
            }
        });

        expect(wrapper.find(FileFormat).prop('value')).toEqual('binaryFile');
        expect(wrapper.find(FileFormatBinary).length).toEqual(1);
    });

    it('should throw error with unsupported format', () => {
        const props = {
            inputValues: {
                format: 'smth',
                operation: 'operation',
                header: 'header',
                delimiter: 'delimeter',
                useSchema: 'true'
            },
            handleInputChange: jest.fn(),
            ableToEdit: true
        };
        expect(() => mount(<FileFormatProperties {...props} />)).toThrow();
    });
});
