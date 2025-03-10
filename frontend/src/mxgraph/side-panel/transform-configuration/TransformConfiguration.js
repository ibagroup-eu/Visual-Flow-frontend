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
import SelectField from '../../../components/select-field';
import { OTHER } from '../../constants';
import ReadTextFields from '../../../components/rw-text-fields';
import ConfigurationDivider from '../../../components/divider';
import ReadWriteEditorField from '../../../components/rw-editor-field';

const mode = [
    {
        value: 'Simple',
        label: 'Simple'
    },
    {
        value: 'Full_SQL',
        label: 'Full SQL'
    }
];

const TransformConfiguration = ({
    state,
    ableToEdit,
    onChange,
    openModal,
    required = true
}) => {
    const { t } = useTranslation();
    const fields = [{ field: 'tableName' }];
    const TRANSFORMER_DEFAULT_VALUE = 'Simple';

    return (
        <>
            {state.name && state.operation === 'TRANSFORM' && (
                <>
                    <ConfigurationDivider />
                    <SelectField
                        ableToEdit={ableToEdit}
                        label="jobDesigner:transformConfiguration.Mode"
                        name="mode"
                        value={state.mode}
                        menuItems={mode}
                        handleInputChange={onChange}
                        type={OTHER}
                        defaultValue={TRANSFORMER_DEFAULT_VALUE}
                        required
                    />
                    {state.mode === 'Full_SQL' ? (
                        <ReadTextFields
                            ableToEdit={ableToEdit}
                            fields={fields}
                            inputValues={state}
                            handleInputChange={event =>
                                onChange(event.target.name, event.target.value)
                            }
                            openModal={openModal}
                            required={required}
                        />
                    ) : null}
                    {/* <TextField
                        disabled={!ableToEdit}
                        label={t('jobDesigner:transformConfiguration.Output')}
                        placeholder={t(
                            'jobDesigner:transformConfiguration.Placeholder'
                        )}
                        variant="outlined"
                        fullWidth
                        multiline
                        margin="normal"
                        minRows={16}
                        name="statement"
                        value={state.statement || ''}
                        onChange={event =>
                            onChange(event.target.name, event.target.value)
                        }
                        required
                    /> */}
                    <ReadWriteEditorField
                        inputValues={state}
                        name="statement"
                        placeholder={t('jobDesigner:transformConfiguration.Output')}
                        onChange={event =>
                            onChange(event.target.name, event.target.value)
                        }
                        ableToEdit={ableToEdit}
                        openModal={openModal}
                        required
                    />
                </>
            )}
        </>
    );
};

TransformConfiguration.propTypes = {
    state: PropTypes.object,
    ableToEdit: PropTypes.bool,
    onChange: PropTypes.func,
    openModal: PropTypes.func,
    required: PropTypes.bool
};

export default TransformConfiguration;
