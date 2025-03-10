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
import { READ } from '../../../../constants';
import FileFormatCommonFields from '../file-format-common-fields';
import ReadWriteTextFields from '../../../../../components/rw-text-fields';

const compressionItems = [
    { value: 'none', label: 'none' },
    { value: 'bzip2', label: 'bzip2' },
    { value: 'gzip', label: 'gzip' },
    { value: 'lz4', label: 'lz4' },
    { value: 'snappy', label: 'snappy' },
    { value: 'deflate', label: 'deflate' }
];

const FileFormatJSON = ({
    inputValues,
    handleInputChange,
    ableToEdit,
    openModal
}) => {
    return (
        <>
            <FileFormatCommonFields
                inputValues={inputValues}
                handleInputChange={handleInputChange}
                ableToEdit={ableToEdit}
                openModal={openModal}
                compressionItems={compressionItems}
                defaultCompression="none"
            />
            {inputValues.operation === READ && (
                <ReadWriteTextFields
                    ableToEdit={ableToEdit}
                    fields={[{ field: 'samplingRatio', defaultValue: '1.0' }]}
                    inputValues={inputValues}
                    handleInputChange={handleInputChange}
                    openModal={openModal}
                />
            )}
        </>
    );
};

FileFormatJSON.propTypes = {
    inputValues: PropTypes.object,
    handleInputChange: PropTypes.func,
    ableToEdit: PropTypes.bool,
    openModal: PropTypes.func
};

export default FileFormatJSON;
