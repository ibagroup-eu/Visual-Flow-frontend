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

import useStyles from './IncrementalLoad.Styles';

import { READWRITE, READ } from '../../../constants';
import ParamsSwitchField from '../../../sidebar/params/fields/switch/ParamsSwitchField';
import ReadTextFields from '../../../../components/rw-text-fields';

const offsetFields = [
    {
        field: 'incrementalOffsetKey',
        required: true,
        fieldToClear: 'incrementalOffsetValue',
        reset: true
    },
    {
        field: 'incrementalOffsetValue',
        disabled: true,
        hideModal: true,
        ableToClear: true,
        showConfirmClearModal: true
    }
];

const IncrementalLoad = ({
    inputValues,
    ableToEdit,
    handleInputChange,
    connection,
    openModal
}) => {
    const { t } = useTranslation();
    const classes = useStyles();

    const incrementalLoadChecked = inputValues.incrementalLoad === 'true';
    const showConfirmation = true;

    return (
        <>
            {inputValues.operation === READ && (
                <>
                    <ParamsSwitchField
                        ableToEdit={ableToEdit}
                        label={t('jobDesigner:readConfiguration.incrementalLoad')}
                        name="incrementalLoad"
                        value={
                            inputValues.incrementalLoad === undefined
                                ? undefined
                                : incrementalLoadChecked
                        }
                        onChange={handleInputChange}
                        type={READWRITE}
                        defaultValue={false}
                        connection={connection}
                        initialValue={inputValues.incrementalLoad}
                        showConfirmation={showConfirmation}
                        fieldsToClear={offsetFields}
                    />
                    {incrementalLoadChecked && (
                        <div
                            className={
                                incrementalLoadChecked ? classes.box : undefined
                            }
                        >
                            <ReadTextFields
                                ableToEdit={ableToEdit}
                                fields={offsetFields}
                                inputValues={inputValues}
                                handleInputChange={handleInputChange}
                                openModal={openModal}
                                connection={connection}
                            />
                        </div>
                    )}
                </>
            )}
        </>
    );
};

IncrementalLoad.propTypes = {
    inputValues: PropTypes.object,
    ableToEdit: PropTypes.bool,
    handleInputChange: PropTypes.func,
    connection: PropTypes.object,
    openModal: PropTypes.func
};

export default IncrementalLoad;
