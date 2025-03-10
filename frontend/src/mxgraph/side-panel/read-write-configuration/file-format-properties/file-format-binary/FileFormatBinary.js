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
import { READ, READWRITE } from '../../../../constants';
import FileFormatCommonFields from '../file-format-common-fields';
import SelectField from '../../../../../components/select-field';
import ReadWriteTextFields from '../../../../../components/rw-text-fields';

const format = [
    {
        value: 'pdf',
        label: 'PDF'
    },
    {
        value: 'doc',
        label: 'DOC'
    },
    {
        value: 'docx',
        label: 'DOCX'
    },
    {
        value: 'flac',
        label: 'FLAC'
    },
    {
        value: 'mp3',
        label: 'MP3'
    },
    {
        value: 'mp4',
        label: 'MP4'
    },
    {
        value: 'mpeg',
        label: 'MPEG'
    },
    {
        value: 'mpga',
        label: 'MPGA'
    },
    {
        value: 'm4a',
        label: 'M4A'
    },
    {
        value: 'ogg',
        label: 'OGG'
    },
    {
        value: 'wav',
        label: 'WAV'
    },
    {
        value: 'webm',
        label: 'WEBM'
    }
];

const compressionItems = [
    { value: 'none', label: 'none' },
    { value: 'bzip2', label: 'bzip2' },
    { value: 'gzip', label: 'gzip' },
    { value: 'lz4', label: 'lz4' },
    { value: 'snappy', label: 'snappy' },
    { value: 'deflate', label: 'deflate' }
];

const FileFormatBinary = ({
    inputValues,
    handleInputChange,
    ableToEdit,
    openModal
}) => {
    return (
        <>
            {inputValues.operation === READ && (
                <>
                    <SelectField
                        ableToEdit={ableToEdit}
                        label="jobDesigner:readConfiguration.binaryFormat"
                        name="binaryFormat"
                        value={inputValues.binaryFormat}
                        handleInputChange={handleInputChange}
                        menuItems={format}
                        type={READWRITE}
                        defaultValue="pdf"
                        required
                    />
                    <ReadWriteTextFields
                        ableToEdit={ableToEdit}
                        fields={[{ field: 'outputContentColumn' }]}
                        inputValues={inputValues}
                        handleInputChange={handleInputChange}
                        openModal={openModal}
                        required
                    />
                    <ReadWriteTextFields
                        ableToEdit={ableToEdit}
                        fields={[{ field: 'outputPathColumn' }]}
                        inputValues={inputValues}
                        handleInputChange={handleInputChange}
                        openModal={openModal}
                        required
                    />
                </>
            )}

            <FileFormatCommonFields
                inputValues={inputValues}
                handleInputChange={handleInputChange}
                ableToEdit={ableToEdit}
                openModal={openModal}
                compressionItems={compressionItems}
                defaultCompression="none"
            />
        </>
    );
};

FileFormatBinary.propTypes = {
    inputValues: PropTypes.object,
    handleInputChange: PropTypes.func,
    ableToEdit: PropTypes.bool,
    openModal: PropTypes.func
};

export default FileFormatBinary;
