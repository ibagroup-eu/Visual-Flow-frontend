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
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { READ, READWRITE } from '../../../../constants';
import FileFormatCommonFields from '../file-format-common-fields';
import { ParamsSwitchField } from '../../../../sidebar/params/fields';

export const compressionItemsParquet = [
    { value: 'none', label: 'none' },
    { value: 'uncompressed', label: 'uncompressed' },
    { value: 'snappy', label: 'snappy' },
    { value: 'gzip', label: 'gzip' },
    { value: 'lzo', label: 'lzo' },
    { value: 'brotli', label: 'brotli' },
    { value: 'lz4', label: 'lz4' },
    { value: 'zstd', label: 'zstd' }
];

export const compressionItemsOrc = [
    { value: 'none', label: 'none' },
    { value: 'snappy', label: 'snappy' },
    { value: 'zlib', label: 'zlib' },
    { value: 'lzo', label: 'lzo' },
    { value: 'zstd', label: 'zstd' },
    { value: 'lz4', label: 'lz4' }
];

const FileFormatParquetOrc = ({
    inputValues,
    handleInputChange,
    ableToEdit,
    openModal
}) => {
    const { t } = useTranslation();

    return (
        <>
            <FileFormatCommonFields
                inputValues={inputValues}
                handleInputChange={handleInputChange}
                ableToEdit={ableToEdit}
                openModal={openModal}
                compressionItems={
                    inputValues.format === 'parquet'
                        ? compressionItemsParquet
                        : compressionItemsOrc
                }
                defaultCompression="snappy"
            />
            {inputValues.operation === READ && (
                <ParamsSwitchField
                    ableToEdit={ableToEdit}
                    label={t('jobDesigner:readConfiguration.mergeSchema')}
                    name="mergeSchema"
                    value={
                        inputValues.mergeSchema === undefined
                            ? undefined
                            : inputValues.mergeSchema === 'true'
                    }
                    onChange={handleInputChange}
                    type={READWRITE}
                    defaultValue={false}
                />
            )}
        </>
    );
};

FileFormatParquetOrc.propTypes = {
    inputValues: PropTypes.object,
    handleInputChange: PropTypes.func,
    ableToEdit: PropTypes.bool,
    openModal: PropTypes.func
};

export default FileFormatParquetOrc;
