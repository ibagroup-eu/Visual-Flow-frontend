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
import {
    Button,
    DialogActions,
    Paper,
    Table,
    TableBody,
    TableContainer,
    TextField,
    withStyles
} from '@material-ui/core';
import { AddOutlined } from '@material-ui/icons';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { isEmpty, isEqual, pickBy } from 'lodash';
import PropTypes from 'prop-types';
import PopupForm from '../../../components/popup-form';
import styles from './PromptingModal.Styles';
import PromptingAttributesRow from './PromptingAttributesRow';
import {
    validate,
    VALUE_VALIDATIONS
} from '../../../pages/settings/parameters/validation/useParamValidation';
import { READWRITE } from '../../constants';
import { ParamsSwitchField } from '../../sidebar/params/fields';
import PromptingExamplesRow from './PromptingExamplesRow';
import PromptingDataAttributesRow from './PromptingDataAttributesRow';

const DEFAULT_ATTRIBUTES = [
    { name: '', definition: '', placeholder: '', confidenceThreshold: '' }
];

const DEFAULT_DATA_ATTRIBUTES = [{ name: '', definition: '' }];

const DEFAULT_EXAMPLES = [{ user: '', assistant: '' }];

export const PromptingModal = ({
    classes,
    attributes: initialAttributes = [],
    examples: initialExamples = [],
    open,
    onClose,
    onSave,
    editable,
    modalTitle,
    buttonTitle,
    fieldName,
    keyValidations = VALUE_VALIDATIONS,
    valueValidations = VALUE_VALIDATIONS,
    options = [],
    state,
    onChange
}) => {
    const [systemMessage, setSystemMessage] = useState();
    const [keepExtraAttributes, setKeepExtraAttributes] = useState();
    const [userMessage, setUserMessage] = useState();

    const [attributes, setAttributes] = useState(initialAttributes);
    const [errorsAttributes, setErrorsAttributes] = useState([]);
    const [examples, setExamples] = useState(initialExamples);
    const [errorsExamples, setErrorsExamples] = useState([]);
    const { t } = useTranslation();

    const areEqualFields = () => {
        if (state.task === 'parseText') {
            return (
                systemMessage === state.systemMessage &&
                keepExtraAttributes === state.keepExtraAttributes
            );
        }
        if (state.task === 'generateData') {
            return systemMessage === state.systemMessage;
        }
        if (state.task === 'genericTask') {
            return (
                systemMessage === state.systemMessage &&
                userMessage === state.userMessage
            );
        }
        return true;
    };

    useEffect(() => {
        setSystemMessage(state.systemMessage || '');
        setKeepExtraAttributes(
            state.keepExtraAttributes === undefined
                ? 'false'
                : String(state.keepExtraAttributes === 'true')
        );
        setUserMessage(state.userMessage || '');
    }, []);

    const validateRowAttribute = (row, arr) => {
        const nameValidationError = validate(row.name, keyValidations, arr);

        return pickBy(
            {
                nameValidationError: t(nameValidationError)
            },
            v => !isEmpty(v)
        );
    };

    const handleRemoveAttribute = index => () =>
        setAttributes(prev => {
            const result = [...prev.slice(0, index), ...prev.slice(index + 1)];
            setErrorsAttributes(
                result.map(row => validateRowAttribute(row, result))
            );
            return result;
        });

    const handleAttributeChange = (index, value) => {
        setAttributes(prev => {
            const copy = [...prev];
            copy[index] = value;
            setErrorsAttributes(copy.map(row => validateRowAttribute(row, copy)));
            return copy;
        });
    };

    const validAttributes = attributes.every(row => {
        const value = validateRowAttribute(row, attributes);
        return isEmpty(value);
    });

    const onAddAttributes = () => {
        setAttributes(values => values.concat(DEFAULT_ATTRIBUTES));
    };

    const renderAttribute = (
        { name, definition, placeholder, confidenceThreshold },
        index
    ) => {
        return (
            <PromptingAttributesRow
                key={index}
                index={index}
                size={attributes.length}
                disabled={!editable}
                name={name}
                definition={definition}
                placeholder={placeholder}
                confidenceThreshold={confidenceThreshold}
                errors={errorsAttributes[index]}
                onChange={handleAttributeChange}
                onRemove={handleRemoveAttribute}
                fieldName={fieldName}
                options={options}
            />
        );
    };

    const validateRowDataAttribute = (row, arr) => {
        const nameValidationError = validate(row.name, keyValidations, arr);
        const valueValidationError = validate(row.definition, valueValidations, arr);

        return pickBy(
            {
                nameValidationError: t(nameValidationError),
                definitionValidationError: t(valueValidationError)
            },
            v => !isEmpty(v)
        );
    };

    const handleRemoveDataAttribute = index => () =>
        setAttributes(prev => {
            const result = [...prev.slice(0, index), ...prev.slice(index + 1)];
            setErrorsAttributes(
                result.map(row => validateRowDataAttribute(row, result))
            );
            return result;
        });

    const handleDataAttributeChange = (index, value) => {
        setAttributes(prev => {
            const copy = [...prev];
            copy[index] = value;
            setErrorsAttributes(
                copy.map(row => validateRowDataAttribute(row, copy))
            );
            return copy;
        });
    };

    const validDataAttributes = attributes.every(row => {
        const value = validateRowDataAttribute(row, attributes);
        return isEmpty(value);
    });

    const onAddDataAttributes = () => {
        setAttributes(values => values.concat(DEFAULT_DATA_ATTRIBUTES));
    };

    const renderDataAttribute = ({ name, definition }, index) => {
        return (
            <PromptingDataAttributesRow
                key={index}
                index={index}
                size={attributes.length}
                disabled={!editable}
                name={name}
                definition={definition}
                errors={errorsAttributes[index]}
                onChange={handleDataAttributeChange}
                onRemove={handleRemoveDataAttribute}
                fieldName={fieldName}
                options={options}
            />
        );
    };

    const validateRowExample = (row, arr) => {
        const nameValidationError = validate(row.user, keyValidations, arr);
        const valueValidationError = validate(row.assistant, valueValidations, arr);

        return pickBy(
            {
                userValidationError: t(nameValidationError),
                assistantValidationError: t(valueValidationError)
            },
            v => !isEmpty(v)
        );
    };

    const handleRemoveExample = index => () =>
        setExamples(prev => {
            const result = [...prev.slice(0, index), ...prev.slice(index + 1)];
            setErrorsExamples(result.map(row => validateRowExample(row, result)));
            return result;
        });

    const handleExampleChange = (index, value) => {
        setExamples(prev => {
            const copy = [...prev];
            copy[index] = value;
            setErrorsExamples(copy.map(row => validateRowExample(row, copy)));
            return copy;
        });
    };

    const validExamples = examples.every(row => {
        const value = validateRowExample(row, examples);
        return isEmpty(value);
    });

    const onAddExamples = () => {
        setExamples(values => values.concat(DEFAULT_EXAMPLES));
    };

    const renderExample = ({ user, assistant }, index) => {
        return (
            <PromptingExamplesRow
                key={index}
                index={index}
                size={attributes.length}
                disabled={!editable}
                user={user}
                assistant={assistant}
                errors={errorsExamples[index]}
                onChange={handleExampleChange}
                onRemove={handleRemoveExample}
                fieldName={fieldName}
                options={options}
            />
        );
    };

    const isInvalidAttributes = validAttr =>
        !validAttr ||
        (isEqual(attributes, initialAttributes) &&
            isEqual(examples, initialExamples) &&
            areEqualFields()) ||
        !attributes.length ||
        (!validExamples && !!examples.length);

    const isInvalidModal = () => {
        if (state.task === 'parseText') {
            return isInvalidAttributes(validAttributes);
        }
        if (state.task === 'generateData') {
            return isInvalidAttributes(validDataAttributes);
        }
        if (state.task === 'genericTask') {
            return (
                !state.userMessage ||
                (isEqual(examples, initialExamples) && areEqualFields()) ||
                (!validExamples && !!examples.length)
            );
        }
        return true;
    };

    return (
        <PopupForm
            className={classes.root}
            display={open}
            onClose={onClose}
            title={modalTitle}
            isNotHelper
        >
            <TextField
                className={classes.columns}
                disabled={!editable}
                label={t('jobDesigner:aiConfiguration.modal.SystemMessage')}
                variant="outlined"
                fullWidth
                multiline
                minRows={6}
                placeholder={
                    'You are JSON parser...\nTerminology:\nTerm - ..\nTerm - ..'
                }
                name="systemMessage"
                value={state.systemMessage || ''}
                onChange={onChange}
            />

            {state.task === 'parseText' && (
                <>
                    <ParamsSwitchField
                        ableToEdit={editable}
                        label={t(
                            'jobDesigner:aiConfiguration.modal.KeepExtraAttributes'
                        )}
                        name="keepExtraAttributes"
                        value={
                            state.keepExtraAttributes === undefined
                                ? undefined
                                : state.keepExtraAttributes === 'true'
                        }
                        type={READWRITE}
                        onChange={onChange}
                        defaultValue={false}
                    />
                    <Button
                        autoFocus
                        disabled={!editable}
                        className={classes.addButton}
                        onClick={onAddAttributes}
                        startIcon={<AddOutlined />}
                    >
                        {buttonTitle.addAttributeButton}
                    </Button>
                    <TableContainer component={Paper} className={classes.table}>
                        <Table>
                            <TableBody>{attributes.map(renderAttribute)}</TableBody>
                        </Table>
                    </TableContainer>
                </>
            )}

            {state.task === 'generateData' && (
                <>
                    <Button
                        autoFocus
                        disabled={!editable}
                        className={classes.addButton}
                        onClick={onAddDataAttributes}
                        startIcon={<AddOutlined />}
                    >
                        {buttonTitle.addAttributeButton}
                    </Button>
                    <TableContainer component={Paper} className={classes.table}>
                        <Table>
                            <TableBody>
                                {attributes.map(renderDataAttribute)}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </>
            )}

            {state.task === 'genericTask' && (
                <TextField
                    className={classes.columns}
                    disabled={!editable}
                    label={t('jobDesigner:aiConfiguration.modal.UserMessage')}
                    variant="outlined"
                    fullWidth
                    multiline
                    minRows={6}
                    placeholder={
                        'Translate to Spanish the following text "This is a simple example of the text message"'
                    }
                    name="userMessage"
                    value={state.userMessage || ''}
                    onChange={onChange}
                    required
                />
            )}

            <Button
                autoFocus
                disabled={!editable}
                className={classes.addButton}
                onClick={onAddExamples}
                startIcon={<AddOutlined />}
            >
                {buttonTitle.addExampleButton}
            </Button>
            <TableContainer component={Paper} className={classes.table}>
                <Table>
                    <TableBody>{examples.map(renderExample)}</TableBody>
                </Table>
            </TableContainer>

            <DialogActions className={classes.buttonsGroup}>
                <Button
                    className={classes.button}
                    onClick={() => onSave(attributes, examples)}
                    color="primary"
                    variant="contained"
                    disabled={!editable || isInvalidModal()}
                >
                    {t('main:button.Save')}
                </Button>
                <Button
                    className={classNames(classes.button, classes.cancelBtn)}
                    onClick={onClose}
                    variant="contained"
                >
                    {t('main:button.Cancel')}
                </Button>
            </DialogActions>
        </PopupForm>
    );
};

PromptingModal.propTypes = {
    attributes: PropTypes.array,
    examples: PropTypes.array,
    classes: PropTypes.object,
    open: PropTypes.bool,
    onClose: PropTypes.func,
    onSave: PropTypes.func,
    editable: PropTypes.bool,
    modalTitle: PropTypes.string,
    buttonTitle: PropTypes.object,
    options: PropTypes.array,
    fieldName: PropTypes.string,
    keyValidations: PropTypes.object,
    valueValidations: PropTypes.object,
    state: PropTypes.object,
    onChange: PropTypes.func
};

export default withStyles(styles)(PromptingModal);
