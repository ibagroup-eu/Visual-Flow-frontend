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
import { TextField } from '@material-ui/core';
import SelectField from '../../../../components/select-field';
import { READWRITE } from '../../../constants';
import useStyles from '../use-window-function-operation/UseWindowFunctionOperation.Styles';

const columnTypeList = [
    'boolean',
    'byte',
    'short',
    'integer',
    'long',
    'float',
    'double',
    'date',
    'timestamp',
    'string',
    'binary',
    'decimal'
].map(value => ({
    value,
    label: value
}));

export const isValidPrecision = value => {
    if (!value.trim()) {
        return ['main:validation.notBlank'];
    }

    if (+value < 1 || +value > 38) {
        return [
            'main:validation.withColumnValidation.range',
            {
                min: 1,
                max: 38
            }
        ];
    }
    if (!Number.isInteger(+value)) {
        return ['main:validation.withColumnValidation.integer'];
    }
    return null;
};

export const isValidScale = (value, precision) => {
    if (!value.trim()) {
        return ['main:validation.notBlank'];
    }
    const maxPrecision = precision > 0 && precision <= 38 ? precision - 1 : 37;

    if (+value < 0 || +value > +maxPrecision) {
        return [
            'main:validation.withColumnValidation.range',
            {
                min: 0,
                max: Math.floor(maxPrecision)
            }
        ];
    }
    if (!Number.isInteger(+value)) {
        return ['main:validation.withColumnValidation.integer'];
    }
    return null;
};

export const parseDecimalType = value => {
    const precision = value?.includes('decimal(')
        ? value?.slice(value?.indexOf('(') + 1, value?.lastIndexOf(','))
        : '10';
    const scale = value?.includes('decimal(')
        ? value?.slice(value?.indexOf(',') + 1, value?.lastIndexOf(')'))
        : '0';
    return [precision, scale];
};

const ChangeTypeOperation = ({ state, ableToEdit, handleInputChange }) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const [precisionErrors, setPrecisionErrors] = useState();
    const [scaleErrors, setScaleErrors] = useState();

    const columnTypeField = 'option.columnType';

    const columnType = state[columnTypeField];
    const type = columnType?.includes('decimal(')
        ? columnType?.substring(0, columnType?.indexOf('('))
        : columnType;
    const [precision, scale] = parseDecimalType(columnType);

    useEffect(() => {
        const validPrecision = isValidPrecision(precision);
        setPrecisionErrors(validPrecision && t(...validPrecision));
        const validScale = isValidScale(scale, precision);
        setScaleErrors(validScale && t(...validScale));
    }, [precision, scale, t]);

    const handleDecimalChange = (newPrecision, newScale) => {
        const value = `${type}(${newPrecision},${newScale})`;

        handleInputChange({
            target: {
                name: columnTypeField,
                value
            }
        });
    };

    const handlePrecisionChange = event =>
        handleDecimalChange(event.target.value, scale);

    const handleScaleChange = event =>
        handleDecimalChange(precision, event.target.value);

    const handleColumnTypeChange = event => {
        if (event.target.value === 'decimal') {
            const value = `${event.target.value}(${precision},${scale})`;

            handleInputChange({
                target: {
                    name: columnTypeField,
                    value
                }
            });
        } else {
            handleInputChange(event);
        }
    };

    return (
        <>
            <SelectField
                ableToEdit={ableToEdit}
                label={t('jobDesigner:withColumnConfiguration.columnType')}
                name="option.columnType"
                value={
                    columnType?.endsWith(')')
                        ? columnType.slice(0, columnType.indexOf('('))
                        : columnType
                }
                menuItems={columnTypeList}
                handleInputChange={handleColumnTypeChange}
                type={READWRITE}
                required
            />
            {columnType?.includes('decimal') && (
                <>
                    <TextField
                        className={classes.partitionBy}
                        disabled={!ableToEdit}
                        label={t('jobDesigner:withColumnConfiguration.precision')}
                        placeholder={t(
                            'jobDesigner:withColumnConfiguration.precision'
                        )}
                        variant="outlined"
                        fullWidth
                        name="precision"
                        value={precision}
                        onChange={handlePrecisionChange}
                        type="number"
                        inputProps={{ step: 1, min: 1, max: 38 }}
                        InputLabelProps={{
                            shrink: true
                        }}
                        helperText={precisionErrors}
                        error={!!precisionErrors}
                    />
                    <TextField
                        disabled={!ableToEdit}
                        label={t('jobDesigner:withColumnConfiguration.scale')}
                        placeholder={t('jobDesigner:withColumnConfiguration.scale')}
                        variant="outlined"
                        fullWidth
                        name="scale"
                        value={scale}
                        onChange={handleScaleChange}
                        type="number"
                        inputProps={{ step: 1, min: 0, max: 37 }}
                        InputLabelProps={{
                            shrink: true
                        }}
                        helperText={scaleErrors}
                        error={!!scaleErrors}
                    />
                </>
            )}
        </>
    );
};

ChangeTypeOperation.propTypes = {
    state: PropTypes.object,
    ableToEdit: PropTypes.bool,
    handleInputChange: PropTypes.func
};

export default ChangeTypeOperation;
