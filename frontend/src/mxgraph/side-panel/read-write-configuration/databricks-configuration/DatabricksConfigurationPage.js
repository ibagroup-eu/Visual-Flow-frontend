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
import ReadTextFields from '../../../../components/rw-text-fields';
import WriteMode from '../helpers/WriteMode';
import { WRITE, READWRITE } from '../../../constants';
import SelectField from '../../../../components/select-field';
import FileFormatProperties from '../file-format-properties';
import TableProperties from '../table-properties';
import AutocompleteParameter from '../../autocomplete-parameter';
import useStyles from './DatabricksConfigurationPage.Styles';

const catalogShchemaFields = [{ field: 'catalog' }, { field: 'schema' }];
const tableField = [{ field: 'table' }];
const volumeFields = [{ field: 'volume' }, { field: 'volumePath' }];

const objectType = [
    {
        value: 'table',
        label: 'Table'
    },
    {
        value: 'volume',
        label: 'Volume'
    }
];

const DatabricksConfigurationPage = ({
    inputValues,
    handleInputChange,
    openModal,
    ableToEdit
}) => {
    const { t } = useTranslation();
    const classes = useStyles();

    return (
        <>
            <ReadTextFields
                ableToEdit={ableToEdit}
                fields={catalogShchemaFields}
                inputValues={inputValues}
                handleInputChange={handleInputChange}
                openModal={openModal}
                required
            />
            <SelectField
                ableToEdit={ableToEdit}
                label="jobDesigner:readConfiguration.objectType"
                name="objectType"
                value={inputValues.objectType}
                handleInputChange={handleInputChange}
                menuItems={objectType}
                type={READWRITE}
                defaultValue="table"
                required
            />
            {inputValues.objectType === 'volume' && (
                <ReadTextFields
                    ableToEdit={ableToEdit}
                    fields={volumeFields}
                    inputValues={inputValues}
                    handleInputChange={handleInputChange}
                    openModal={openModal}
                    required
                />
            )}
            {inputValues.objectType === 'table' && (
                <>
                    <ReadTextFields
                        ableToEdit={ableToEdit}
                        fields={tableField}
                        inputValues={inputValues}
                        handleInputChange={handleInputChange}
                        openModal={openModal}
                        required
                    />
                    <TableProperties
                        inputValues={inputValues}
                        handleInputChange={handleInputChange}
                        ableToEdit={ableToEdit}
                        openModal={openModal}
                    />
                </>
            )}
            {inputValues.operation === WRITE && (
                <WriteMode
                    disabled={!ableToEdit}
                    value={inputValues.writeMode}
                    onChange={handleInputChange}
                    required
                />
            )}
            {inputValues.objectType === 'volume' && (
                <FileFormatProperties
                    ableToEdit={ableToEdit}
                    inputValues={inputValues}
                    handleInputChange={handleInputChange}
                    openModal={openModal}
                />
            )}
            {inputValues.operation === WRITE && (
                <AutocompleteParameter
                    handleInputChange={handleInputChange}
                    ableToEdit={ableToEdit}
                    className={classes.autocomplete}
                    id="partitionBy"
                    name="partitionBy"
                    state={inputValues}
                    label={t('jobDesigner:writeConfiguration.PartitionBy')}
                />
            )}
        </>
    );
};

DatabricksConfigurationPage.propTypes = {
    handleInputChange: PropTypes.func,
    openModal: PropTypes.func,
    ableToEdit: PropTypes.bool,
    inputValues: PropTypes.shape({
        operation: PropTypes.string,
        writeMode: PropTypes.string,
        objectType: PropTypes.string
    })
};

export default DatabricksConfigurationPage;
