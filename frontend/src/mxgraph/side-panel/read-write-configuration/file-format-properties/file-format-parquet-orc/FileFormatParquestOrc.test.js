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
import { READ, WRITE } from '../../../../constants';
import FileFormatParquetOrc, {
    compressionItemsOrc,
    compressionItemsParquet
} from './FileFormatParquetOrc';
import FileFormatCommonFields from '../file-format-common-fields';
import { ParamsSwitchField } from '../../../../sidebar/params/fields';

jest.mock('react-i18next', () => ({
    ...jest.requireActual('react-i18next'),
    useTranslation: jest.fn()
}));

describe('FileFormatParquetOrc', () => {
    const init = (props = {}) => {
        const defaultProps = { ableToEdit: true };

        useTranslation.mockImplementation(() => ({ t: x => x }));

        return shallow(<FileFormatParquetOrc {...defaultProps} {...props} />);
    };

    it('should render form in read mode', () => {
        const wrapper = init({
            inputValues: {
                operation: READ,
                format: 'parquet'
            }
        });

        expect(
            wrapper.find(FileFormatCommonFields).prop('compressionItems')
        ).toEqual(compressionItemsParquet);
        expect(wrapper.find(ParamsSwitchField).prop('value')).toEqual(undefined);
    });

    it('should render form in read mode with merge schema enabled', () => {
        const wrapper = init({
            inputValues: {
                operation: READ,
                format: 'orc',
                mergeSchema: 'true'
            }
        });

        expect(
            wrapper.find(FileFormatCommonFields).prop('compressionItems')
        ).toEqual(compressionItemsOrc);
        expect(wrapper.find(ParamsSwitchField).prop('value')).toEqual(true);
    });

    it('should render form in write mode', () => {
        const wrapper = init({
            inputValues: {
                operation: WRITE,
                format: 'parquet'
            }
        });

        expect(wrapper.find(ParamsSwitchField).length).toEqual(0);
    });
});
