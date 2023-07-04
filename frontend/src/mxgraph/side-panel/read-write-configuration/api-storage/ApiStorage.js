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

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import ReadTextFields from '../../../../components/rw-text-fields';
import SelectField from '../../../../components/select-field';
import { READWRITE } from '../../../constants';
import { PropertyListModal } from '../../property-list';

import useStyles from './ApiStorage.Styles';
import { MESSAGES } from '../../../../pages/settings/parameters/validation/useParamValidation';

export const HEADER_KEY_VALIDATIONS = {
    [MESSAGES.VALUE_EMPTY]: value => !value?.trim(),
    [MESSAGES.KEY_DUPLICATION]: (value, arr) =>
        arr?.filter(([key]) => key === value).length > 1
};

const method = [
    {
        value: 'GET',
        label: 'GET'
    },
    {
        value: 'POST',
        label: 'POST'
    },
    {
        value: 'PUT',
        label: 'PUT'
    },
    {
        value: 'DELETE',
        label: 'DELETE'
    },
    {
        value: 'PATCH',
        label: 'PATCH'
    }
];

const hostField = [{ field: 'host' }];

export const fromState = items => items?.split(';').map(v => v.split(':')) || [];

export const toState = items => items.map(item => item.join(':')).join(';') || null;

const apiHeaders = 'option.headers';
const apiParams = 'option.params';

const ApiStorage = ({
    inputValues,
    handleInputChange,
    openModal,
    ableToEdit,
    connection,
    setState
}) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const [showModalParams, setShowModalParams] = useState(false);
    const [showModalHeaders, setShowModalHeaders] = useState(false);
    const headers = fromState(inputValues[apiHeaders]);
    const params = fromState(inputValues[apiParams]);

    const handleSave = key => entries => {
        const options = toState(entries);
        setState(prev => {
            return { ...prev, [key]: options };
        });
        if (key === apiHeaders) {
            setShowModalHeaders(false);
        } else {
            setShowModalParams(false);
        }
    };

    return (
        <>
            <ReadTextFields
                fields={hostField}
                openModal={openModal}
                inputValues={inputValues}
                ableToEdit={ableToEdit}
                handleInputChange={handleInputChange}
                connection={connection}
                required
            />
            <SelectField
                ableToEdit={ableToEdit}
                label="jobDesigner:readConfiguration.method"
                name="method"
                value={inputValues.method}
                handleInputChange={handleInputChange}
                menuItems={method}
                type={READWRITE}
                connection={connection}
                required
            />

            {showModalParams && (
                <PropertyListModal
                    modalTitle={t('jobDesigner:apiModal.paramsTitle')}
                    buttonTitle={t('jobDesigner:apiModal.paramsAddButton')}
                    items={params}
                    editable={ableToEdit}
                    open={showModalParams}
                    onSave={handleSave(apiParams)}
                    onClose={() => setShowModalParams(false)}
                />
            )}

            <Button
                variant="outlined"
                className={classes.btn}
                disabled={!ableToEdit}
                onClick={() => setShowModalParams(true)}
            >
                {inputValues[apiParams]?.length
                    ? t('jobDesigner:readConfiguration.editParams')
                    : t('jobDesigner:readConfiguration.addParams')}
            </Button>

            {showModalHeaders && (
                <PropertyListModal
                    modalTitle={t('jobDesigner:apiModal.headersTitle')}
                    buttonTitle={t('jobDesigner:apiModal.headersAddButton')}
                    items={headers}
                    editable={ableToEdit}
                    open={showModalHeaders}
                    onSave={handleSave(apiHeaders)}
                    keyValidations={HEADER_KEY_VALIDATIONS}
                    onClose={() => setShowModalHeaders(false)}
                />
            )}
            <Button
                variant="outlined"
                className={classes.btn}
                disabled={!ableToEdit}
                onClick={() => setShowModalHeaders(true)}
            >
                {inputValues[apiHeaders]?.length
                    ? t('jobDesigner:readConfiguration.editHeaders')
                    : t('jobDesigner:readConfiguration.addHeaders')}
            </Button>
        </>
    );
};

ApiStorage.propTypes = {
    inputValues: PropTypes.object,
    handleInputChange: PropTypes.func,
    openModal: PropTypes.func,
    ableToEdit: PropTypes.bool,
    connection: PropTypes.object,
    setState: PropTypes.func
};

export default ApiStorage;
