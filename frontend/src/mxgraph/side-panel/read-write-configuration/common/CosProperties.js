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
import { TextField, Chip } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import Autocomplete from '@material-ui/lab/Autocomplete';

import { WRITE } from '../../../constants';
import WriteMode from '../helpers/WriteMode';
import ReadTextFields from '../../../../components/rw-text-fields';
import useStyles from './CosProperties.Styles';
import FileFormatProperties from '../file-format-properties';

// eslint-disable-next-line complexity
const CosProperties = ({
    fields,
    openModal,
    inputValues,
    ableToEdit,
    handleInputChange
}) => {
    const { t } = useTranslation();
    const classes = useStyles();

    return (
        <>
            {fields && (
                <ReadTextFields
                    ableToEdit={ableToEdit}
                    fields={fields}
                    inputValues={inputValues}
                    handleInputChange={handleInputChange}
                    openModal={openModal}
                    required
                />
            )}
            {inputValues.operation === WRITE &&
                inputValues.storage !== 'cluster' && (
                    <WriteMode
                        disabled={!ableToEdit}
                        value={inputValues.writeMode}
                        onChange={handleInputChange}
                    />
                )}
            <FileFormatProperties
                ableToEdit={ableToEdit}
                inputValues={inputValues}
                handleInputChange={handleInputChange}
                openModal={openModal}
                conditions={{
                    stage: inputValues.operation,
                    storage: inputValues.storage
                }}
            />
            {inputValues.operation === WRITE && (
                <Autocomplete
                    disabled={!ableToEdit}
                    id="partitionBy"
                    multiple
                    freeSolo
                    autoSelect
                    options={[]}
                    value={inputValues.partitionBy?.split(',') || []}
                    className={classes.divider}
                    onChange={(event, value) =>
                        handleInputChange({
                            target: { name: 'partitionBy', value: value?.join(',') }
                        })
                    }
                    renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                            <Chip
                                variant="outlined"
                                label={option}
                                {...getTagProps({ index })}
                            />
                        ))
                    }
                    renderInput={params => (
                        <TextField
                            {...params}
                            fullWidth
                            variant="outlined"
                            label={t('jobDesigner:writeConfiguration.PartitionBy')}
                        />
                    )}
                />
            )}
        </>
    );
};

CosProperties.propTypes = {
    handleInputChange: PropTypes.func,
    ableToEdit: PropTypes.bool,
    openModal: PropTypes.func,
    fields: PropTypes.arrayOf(PropTypes.object),
    inputValues: PropTypes.shape({
        name: PropTypes.string,
        operation: PropTypes.string,
        writeMode: PropTypes.string,
        optionAvroSchemaName: PropTypes.string,
        partitionBy: PropTypes.string,
        storage: PropTypes.string
    })
};

export default CosProperties;
