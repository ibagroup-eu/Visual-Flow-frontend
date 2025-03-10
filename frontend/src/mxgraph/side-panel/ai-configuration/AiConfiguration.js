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

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Button, TextField } from '@material-ui/core';
import useStyles from './AiConfiguration.Styles';
import ConfigurationDivider from '../../../components/divider';
import ReadTextFields from '../../../components/rw-text-fields';
import SelectField from '../../../components/select-field';
import { OTHER } from '../../constants';
import { ParamsSwitchField } from '../../sidebar/params/fields';
import PromptingModal from '../property-list/PromptingModal';
import { MESSAGES } from '../../../pages/settings/parameters/validation/useParamValidation';

const tasksType = [
    {
        value: 'parseText',
        label: 'Parse text'
    },
    {
        value: 'generateData',
        label: 'Generate data'
    },
    {
        value: 'genericTask',
        label: 'Generic task'
    },
    {
        value: 'transcribe',
        label: 'Transcribe'
    }
];

const llmType = [
    {
        value: 'ChatGPT',
        label: 'OpenAI - ChatGPT'
    }
];

const TASK_DEFAULT_VALUE = 'parseText';
const LLM_DEFAULT_VALUE = 'ChatGPT';

const HEADER_KEY_VALIDATIONS = {
    [MESSAGES.VALUE_EMPTY]: value => !value?.trim(),
    [MESSAGES.KEY_DUPLICATION]: (value, arr) =>
        arr?.filter(({ name }) => name === value).length > 1
};

const fromState = items => JSON.parse(atob(items));

const fromStateExamples = items =>
    JSON.parse(atob(items))?.examples.map(element => ({
        ...element,
        assistant: JSON.parse(atob(element.assistant))
    }));

// eslint-disable-next-line complexity
const AiConfiguration = ({ state, ableToEdit, onChange, openModal, connection }) => {
    const { t } = useTranslation();
    const classes = useStyles();

    const [checked, setChecked] = useState(false);
    const [showModalParams, setShowModalParams] = useState(false);
    const attributes = state?.attributes && fromState(state?.attributes);
    const examples = state?.examples && fromStateExamples(state?.examples);

    useEffect(() => {
        if (state.task === 'parseText') {
            onChange('numberOfRecords', '');
            onChange('outputColumn', '');
            onChange('userMessage', '');
            onChange('pathColumn', '');
        }
        if (state.task === 'generateData') {
            onChange('sourceColumn', '');
            onChange('outputColumn', '');
            onChange('keepExtraAttributes', '');
            onChange('userMessage', '');
            onChange('pathColumn', '');
        }
        if (state.task === 'genericTask') {
            onChange('numberOfRecords', '');
            onChange('keepExtraAttributes', '');
            onChange('pathColumn', '');
        }
        if (state.task === 'transcribe') {
            onChange('numberOfRecords', '');
            onChange('keepExtraAttributes', '');
            onChange('examples', '');
        }
        onChange('attributes', '');
    }, [state.task]);

    const handleSave = () => (modalAttributes, modalExamples) => {
        if (state.task === 'parseText' || state.task === 'generateData') {
            onChange(
                'attributes',
                btoa(JSON.stringify({ attributes: modalAttributes }))
            );
        }

        if (state.task !== 'transcribe') {
            onChange(
                'examples',
                btoa(
                    JSON.stringify({
                        examples: modalExamples.map(element => ({
                            ...element,
                            assistant: btoa(JSON.stringify(element.assistant))
                        }))
                    })
                )
            );
        }

        setShowModalParams(false);
    };

    const handleInputChange = event =>
        onChange(event.target.name, event.target.value);

    const handleSwitchChange = event => setChecked(event.target.value);

    return (
        <>
            {state.name && (
                <>
                    <SelectField
                        className={classes.columns}
                        ableToEdit={ableToEdit}
                        label="jobDesigner:aiConfiguration.Task"
                        name="task"
                        value={state.task}
                        menuItems={tasksType}
                        handleInputChange={onChange}
                        type={OTHER}
                        defaultValue={TASK_DEFAULT_VALUE}
                        required
                    />
                    <ConfigurationDivider />
                    <SelectField
                        className={classes.columns}
                        ableToEdit={ableToEdit}
                        label="jobDesigner:aiConfiguration.Llm"
                        name="llm"
                        value={state.llm}
                        menuItems={llmType}
                        handleInputChange={onChange}
                        type={OTHER}
                        defaultValue={LLM_DEFAULT_VALUE}
                        required
                    />
                    <TextField
                        className={classes.columns}
                        disabled={!ableToEdit}
                        label={t('jobDesigner:aiConfiguration.LlmEndpoint')}
                        variant="outlined"
                        fullWidth
                        name="endpoint"
                        value={state.endpoint || ''}
                        onChange={handleInputChange}
                        required
                    />
                    <TextField
                        className={classes.columns}
                        disabled={!ableToEdit}
                        label={t('jobDesigner:aiConfiguration.ModelName')}
                        variant="outlined"
                        fullWidth
                        name="model"
                        value={state.model || ''}
                        onChange={handleInputChange}
                        required
                    />
                    <ReadTextFields
                        ableToEdit={ableToEdit}
                        fields={[{ field: 'apiKey' }]}
                        inputValues={state}
                        handleInputChange={handleInputChange}
                        openModal={openModal}
                        connection={connection}
                        hidden
                        required
                    />
                    {state.task === 'transcribe' && (
                        <TextField
                            className={classes.columns}
                            disabled={!ableToEdit}
                            label={t('jobDesigner:aiConfiguration.PathColumn')}
                            variant="outlined"
                            fullWidth
                            name="pathColumn"
                            value={state.pathColumn || ''}
                            onChange={handleInputChange}
                            required
                        />
                    )}
                    {state.task !== 'generateData' && (
                        <TextField
                            className={classes.columns}
                            disabled={!ableToEdit}
                            label={t('jobDesigner:aiConfiguration.SourceColumn')}
                            variant="outlined"
                            fullWidth
                            name="sourceColumn"
                            value={state.sourceColumn || ''}
                            onChange={handleInputChange}
                            required
                        />
                    )}
                    {state.task === 'generateData' && (
                        <TextField
                            className={classes.columns}
                            disabled={!ableToEdit}
                            label={t('jobDesigner:aiConfiguration.NumberOfRecords')}
                            variant="outlined"
                            fullWidth
                            name="numberOfRecords"
                            type="number"
                            value={state.numberOfRecords || ''}
                            onChange={handleInputChange}
                            required
                        />
                    )}
                    {(state.task === 'genericTask' ||
                        state.task === 'transcribe') && (
                        <TextField
                            className={classes.columns}
                            disabled={!ableToEdit}
                            label={t('jobDesigner:aiConfiguration.OutputColumn')}
                            variant="outlined"
                            fullWidth
                            name="outputColumn"
                            value={state.outputColumn || ''}
                            onChange={handleInputChange}
                            required
                        />
                    )}
                    <div className={classes.paramSwitch}>
                        <ParamsSwitchField
                            ableToEdit={ableToEdit}
                            label={t('jobDesigner:aiConfiguration.BasicSettings')}
                            name="basicSettings"
                            value={checked}
                            onChange={event => {
                                handleSwitchChange(event);
                            }}
                        />
                    </div>
                    {checked && (
                        <>
                            <TextField
                                className={classes.columns}
                                disabled={!ableToEdit}
                                label={t('jobDesigner:aiConfiguration.MaxResponce')}
                                variant="outlined"
                                fullWidth
                                name="maxTokens"
                                value={state.maxTokens || ''}
                                onChange={handleInputChange}
                                required
                            />
                            <TextField
                                className={classes.columns}
                                disabled={!ableToEdit}
                                label={t('jobDesigner:aiConfiguration.Temperature')}
                                variant="outlined"
                                fullWidth
                                name="temperature"
                                value={state.temperature || ''}
                                onChange={handleInputChange}
                                required
                            />
                        </>
                    )}

                    {showModalParams && (
                        <PromptingModal
                            modalTitle={t(
                                'jobDesigner:aiConfiguration.modal.Prompting'
                            )}
                            buttonTitle={{
                                addAttributeButton: t(
                                    'jobDesigner:aiConfiguration.modal.AddAttribute'
                                ),
                                addExampleButton: t(
                                    'jobDesigner:aiConfiguration.modal.AddExample'
                                )
                            }}
                            attributes={attributes?.attributes}
                            examples={examples}
                            editable={ableToEdit}
                            open={showModalParams}
                            onSave={handleSave(state.attributes, state.examples)}
                            keyValidations={HEADER_KEY_VALIDATIONS}
                            onClose={() => setShowModalParams(false)}
                            state={state}
                            onChange={handleInputChange}
                        />
                    )}

                    {state.task !== 'transcribe' && (
                        <Button
                            variant="outlined"
                            className={classes.btn}
                            disabled={!ableToEdit}
                            onClick={() => setShowModalParams(true)}
                        >
                            {state?.attributes?.length
                                ? t('jobDesigner:aiConfiguration.EditPrompt')
                                : t('jobDesigner:aiConfiguration.AddPrompt')}
                        </Button>
                    )}
                </>
            )}
        </>
    );
};

AiConfiguration.propTypes = {
    state: PropTypes.object,
    ableToEdit: PropTypes.bool,
    onChange: PropTypes.func,
    openModal: PropTypes.func,
    connection: PropTypes.object
};

export default AiConfiguration;
