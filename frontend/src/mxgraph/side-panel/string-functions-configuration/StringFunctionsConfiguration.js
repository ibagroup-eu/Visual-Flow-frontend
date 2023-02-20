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
import { TextField, Box } from '@material-ui/core';
import ConfigurationDivider from '../../../components/divider';
import SelectField from '../../../components/select-field';
import { OTHER } from '../../constants';
import {
    STR_FUNCTION_TYPES,
    CONCAT_WS,
    FORMAT_NUMBER,
    ASCII,
    BASE64,
    LOWER,
    TITLE_CASE,
    UNBASE64,
    UPPER,
    DECODE,
    ENCODE,
    FORMAT_STRING,
    INSTR,
    LOCATE,
    RPAD,
    LPAD,
    TRIM,
    RTRIM,
    LTRIM,
    REGEXP_EXTRACT,
    REPEAT,
    SPLIT,
    SUBSTRING,
    SUBSTRING_INDEX,
    LENGTH
} from './constants';
import ConcatWsParameter from './function-parameters/ConcatWs';
import useStyles from './StringFunctionsConfiguration.Styles';
import DecodParameter from './function-parameters/Decod';
import FormatNumberParameter from './function-parameters/FormatNumber';
import FormatStringParameter from './function-parameters/FormatString';
import InstrLocateParameter from './function-parameters/InstrLocate';
import PadParameter from './function-parameters/Pad';
import TrimParameter from './function-parameters/Trim';
import RegexpParameter from './function-parameters/Regexp_extract';
import RepeatParameter from './function-parameters/Repeat';
import SubstringIndexParameter from './function-parameters/SubstringIndex';

// eslint-disable-next-line complexity
export const getFuncParameters = name => {
    switch (name) {
        case CONCAT_WS:
            return ConcatWsParameter;
        case DECODE:
        case ENCODE:
            return DecodParameter;
        case FORMAT_NUMBER:
            return FormatNumberParameter;
        case FORMAT_STRING:
            return FormatStringParameter;
        case INSTR:
        case LOCATE:
            return InstrLocateParameter;
        case RPAD:
        case LPAD:
        case SUBSTRING:
            return PadParameter;
        case TRIM:
        case LTRIM:
        case RTRIM:
            return TrimParameter;
        case REGEXP_EXTRACT:
        case SPLIT:
            return RegexpParameter;
        case REPEAT:
            return RepeatParameter;
        case SUBSTRING_INDEX:
            return SubstringIndexParameter;
        default:
            throw new Error(`Unsupported operation: ${name}`);
    }
};

const StringFunctionsConfiguration = ({ state, ableToEdit, onChange }) => {
    const { t } = useTranslation();
    const classes = useStyles();

    const renderFunctionParameterComponent = name => {
        const Comp = getFuncParameters(name);
        return <Comp ableToEdit={ableToEdit} state={state} onChange={onChange} />;
    };

    return (
        <>
            {state.name && (
                <>
                    <SelectField
                        ableToEdit={ableToEdit}
                        label="jobDesigner:stringFunctionsConfiguration.OperationType"
                        name="function"
                        value={state.function}
                        menuItems={STR_FUNCTION_TYPES}
                        handleInputChange={onChange}
                        type={OTHER}
                        required
                    />
                    {state.function && (
                        <>
                            <ConfigurationDivider />
                            <Box className={classes.sourceColumn}>
                                <TextField
                                    disabled={!ableToEdit}
                                    label={t(
                                        'jobDesigner:stringFunctionsConfiguration.SourceColumn'
                                    )}
                                    placeholder={t(
                                        'jobDesigner:stringFunctionsConfiguration.SourceColumn'
                                    )}
                                    variant="outlined"
                                    fullWidth
                                    name="sourceColumn"
                                    value={state['option.sourceColumn'] || ''}
                                    onChange={event =>
                                        onChange(
                                            'option.sourceColumn',
                                            event.target.value
                                        )
                                    }
                                    required
                                />
                            </Box>
                            <TextField
                                disabled={!ableToEdit}
                                label={t(
                                    'jobDesigner:stringFunctionsConfiguration.TargetColumn'
                                )}
                                placeholder={t(
                                    'jobDesigner:stringFunctionsConfiguration.TargetColumn'
                                )}
                                variant="outlined"
                                fullWidth
                                name="targetColumn"
                                value={state['option.targetColumn'] || ''}
                                onChange={event =>
                                    onChange(
                                        'option.targetColumn',
                                        event.target.value
                                    )
                                }
                                required
                            />
                            {![
                                ASCII,
                                BASE64,
                                LOWER,
                                TITLE_CASE,
                                LENGTH,
                                UNBASE64,
                                UPPER
                            ].includes(state.function) &&
                                renderFunctionParameterComponent(state.function)}
                        </>
                    )}
                </>
            )}
        </>
    );
};

StringFunctionsConfiguration.propTypes = {
    state: PropTypes.object,
    ableToEdit: PropTypes.bool,
    onChange: PropTypes.func
};

export default StringFunctionsConfiguration;
