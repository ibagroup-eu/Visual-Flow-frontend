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
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { READ, WRITE, READWRITE } from '../../../../constants';
import ReadWriteTextFields from '../../../../../components/rw-text-fields';
import DateTimeField from '../../../../../components/date-time-field';
import { ParamsSwitchField } from '../../../../sidebar/params/fields';
import SelectField from '../../../../../components/select-field';

const stringFields = [{ field: 'pathGlobFilter' }, { field: 'recursiveFileLookup' }];

const FileFormatCommonFields = ({
    inputValues,
    handleInputChange,
    ableToEdit,
    openModal,
    compressionItems,
    defaultCompression
}) => {
    const { t } = useTranslation();

    useEffect(() => {
        if (
            inputValues.operation === WRITE &&
            inputValues.format &&
            compressionItems.every(item => item.value !== inputValues.compression)
        ) {
            handleInputChange({
                target: {
                    name: 'compression',
                    value: defaultCompression
                }
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inputValues.format]);

    return (
        <>
            {inputValues.operation === READ && (
                <>
                    <ParamsSwitchField
                        ableToEdit={ableToEdit}
                        label={t('jobDesigner:writeConfiguration.fileSelection')}
                        name="fileSelection"
                        value={
                            inputValues.fileSelection === undefined
                                ? undefined
                                : inputValues.fileSelection === 'true'
                        }
                        onChange={handleInputChange}
                        type={READWRITE}
                        defaultValue={false}
                    />
                    {inputValues.fileSelection === 'true' && (
                        <>
                            <ReadWriteTextFields
                                ableToEdit={ableToEdit}
                                fields={stringFields}
                                inputValues={inputValues}
                                handleInputChange={handleInputChange}
                                openModal={openModal}
                            />
                            <DateTimeField
                                name="modifiedBefore"
                                label={t(
                                    'jobDesigner:readConfiguration.modifiedBefore'
                                )}
                                inputValues={inputValues}
                                handleInputChange={handleInputChange}
                                ableToEdit={ableToEdit}
                            />
                            <DateTimeField
                                name="modifiedAfter"
                                label={t(
                                    'jobDesigner:readConfiguration.modifiedAfter'
                                )}
                                inputValues={inputValues}
                                handleInputChange={handleInputChange}
                                ableToEdit={ableToEdit}
                            />
                        </>
                    )}
                </>
            )}
            {inputValues.operation === WRITE && (
                <>
                    <ParamsSwitchField
                        ableToEdit={ableToEdit}
                        label={t('jobDesigner:writeConfiguration.useCompression')}
                        name="useCompression"
                        value={
                            inputValues.useCompression === undefined
                                ? undefined
                                : inputValues.useCompression === 'true'
                        }
                        onChange={handleInputChange}
                        type={READWRITE}
                        defaultValue={false}
                    />
                    {inputValues.useCompression === 'true' && (
                        <SelectField
                            ableToEdit={ableToEdit}
                            label="jobDesigner:writeConfiguration.compression"
                            name="compression"
                            value={
                                compressionItems.find(
                                    item => item.value === inputValues.compression
                                )?.value || ''
                            }
                            handleInputChange={handleInputChange}
                            menuItems={compressionItems}
                            type={READWRITE}
                            defaultValue={defaultCompression}
                        />
                    )}
                </>
            )}
        </>
    );
};

FileFormatCommonFields.propTypes = {
    handleInputChange: PropTypes.func,
    ableToEdit: PropTypes.bool,
    inputValues: PropTypes.object,
    openModal: PropTypes.func,
    compressionItems: PropTypes.array,
    defaultCompression: PropTypes.string
};

export default FileFormatCommonFields;
