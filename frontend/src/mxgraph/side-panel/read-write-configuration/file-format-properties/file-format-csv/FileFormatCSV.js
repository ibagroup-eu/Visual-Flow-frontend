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
import { Divider } from '@material-ui/core';
import { READ, WRITE, READWRITE } from '../../../../constants';
import CsvHeader from '../../helpers/CsvHeader';
import Delimiter from '../../helpers/Delimiter';
import FileFormatCommonFields from '../file-format-common-fields';
import ReadWriteTextFields from '../../../../../components/rw-text-fields';
import { ParamsSwitchField } from '../../../../sidebar/params/fields';
import useStyles from '../FileFormatProperties.Styles';

const compressionItems = [
    { value: 'none', label: 'none' },
    { value: 'bzip2', label: 'bzip2' },
    { value: 'gzip', label: 'gzip' },
    { value: 'lz4', label: 'lz4' },
    { value: 'snappy', label: 'snappy' },
    { value: 'deflate', label: 'deflate' }
];

const schemaFields = [{ field: 'inferSchema' }, { field: 'enforceSchema' }];

const getToggleValue = value => (value === undefined ? undefined : value === 'true');

const FileFormatCSV = ({
    inputValues,
    handleInputChange,
    ableToEdit,
    openModal
}) => {
    const classes = useStyles();
    const { t } = useTranslation();

    return (
        <>
            <Divider className={classes.divider} />
            <CsvHeader
                value={getToggleValue(inputValues.header)}
                onChange={handleInputChange}
                ableToEdit={ableToEdit}
            />
            <Delimiter
                value={inputValues.delimiter || ''}
                onChange={handleInputChange}
                ableToEdit={ableToEdit}
            />
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
            <ReadWriteTextFields
                ableToEdit={ableToEdit}
                fields={[{ field: 'quote' }]}
                inputValues={inputValues}
                handleInputChange={handleInputChange}
                openModal={openModal}
            />
            {inputValues.operation === WRITE && (
                <ParamsSwitchField
                    ableToEdit={ableToEdit}
                    label={t('jobDesigner:writeConfiguration.quoteAll')}
                    name="quoteAll"
                    value={getToggleValue(inputValues.quoteAll)}
                    onChange={handleInputChange}
                    type={READWRITE}
                    defaultValue={false}
                />
            )}
            <ReadWriteTextFields
                ableToEdit={ableToEdit}
                fields={[{ field: 'escape' }]}
                inputValues={inputValues}
                handleInputChange={handleInputChange}
                openModal={openModal}
            />
            {inputValues.operation === WRITE && (
                <ParamsSwitchField
                    ableToEdit={ableToEdit}
                    label={t('jobDesigner:writeConfiguration.escapeQuotes')}
                    name="escapeQuotes"
                    value={getToggleValue(inputValues.escapeQuotes)}
                    onChange={handleInputChange}
                    type={READWRITE}
                    defaultValue
                />
            )}
            {inputValues.operation === READ && (
                <ReadWriteTextFields
                    ableToEdit={ableToEdit}
                    fields={schemaFields}
                    inputValues={inputValues}
                    handleInputChange={handleInputChange}
                    openModal={openModal}
                />
            )}
            <ParamsSwitchField
                ableToEdit={ableToEdit}
                label={t('jobDesigner:readConfiguration.fineTuneValues')}
                name="fineTuneValues"
                value={getToggleValue(inputValues.fineTuneValues)}
                onChange={handleInputChange}
                type={READWRITE}
                defaultValue={false}
            />
            {inputValues.fineTuneValues === 'true' && (
                <>
                    <ParamsSwitchField
                        ableToEdit={ableToEdit}
                        label={t(
                            'jobDesigner:readConfiguration.ignoreLeadingWhiteSpace'
                        )}
                        name="ignoreLeadingWhiteSpace"
                        value={getToggleValue(inputValues.ignoreLeadingWhiteSpace)}
                        onChange={handleInputChange}
                        type={READWRITE}
                        defaultValue={inputValues.operation === WRITE}
                    />
                    <ParamsSwitchField
                        ableToEdit={ableToEdit}
                        label={t(
                            'jobDesigner:readConfiguration.ignoreTrailingWhiteSpace'
                        )}
                        name="ignoreTrailingWhiteSpace"
                        value={getToggleValue(inputValues.ignoreTrailingWhiteSpace)}
                        onChange={handleInputChange}
                        type={READWRITE}
                        defaultValue={inputValues.operation === WRITE}
                    />
                    <ReadWriteTextFields
                        ableToEdit={ableToEdit}
                        fields={[{ field: 'nullValue' }]}
                        inputValues={inputValues}
                        handleInputChange={handleInputChange}
                        openModal={openModal}
                    />
                    {inputValues.operation === READ && (
                        <ReadWriteTextFields
                            ableToEdit={ableToEdit}
                            fields={[{ field: 'nanValue', defaultValue: 'NaN' }]}
                            inputValues={inputValues}
                            handleInputChange={handleInputChange}
                            openModal={openModal}
                        />
                    )}
                </>
            )}
        </>
    );
};

FileFormatCSV.propTypes = {
    inputValues: PropTypes.object,
    handleInputChange: PropTypes.func,
    ableToEdit: PropTypes.bool,
    openModal: PropTypes.func
};

export default FileFormatCSV;
