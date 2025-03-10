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

import React, { forwardRef, useImperativeHandle, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Grid, Fade } from '@material-ui/core';
import { uniqueId, get } from 'lodash';
import { useTranslation } from 'react-i18next';
import useStyles from './AvroSchema.Styles';
import types, { NULL } from './types';
import Row from './row';
import { duplicates, insert, remove, swap, update } from '../../utils/array';
import SearchInput from '../search-input';

export const DEFAULT_SCHEMA_FIELDS = [
    {
        name: '',
        type: [NULL, types.Boolean]
    }
];

export const toField = field => {
    const type = Array.isArray(field.type)
        ? get(
              field.type.filter(avroType => avroType !== NULL),
              0,
              types.Boolean
          )
        : field.type;

    const nullable = Array.isArray(field.type) && field.type.includes(NULL);

    return {
        id: uniqueId(),
        defaultName: field.name,
        defaultNullable: nullable,
        defaultType: type,
        name: field.name,
        nullable,
        type
    };
};

export const toSchema = field => ({
    name: field.name,
    type: field.nullable ? [NULL, field.type] : field.type
});

export const checkDuplicates = updatedFields => {
    const duplicatedFields = duplicates(
        updatedFields,
        field => `${field.name}-${field.type}-${field.nullable}}`
    );

    return updatedFields.map((field, index) => ({
        ...field,
        duplicated: duplicatedFields.has(index)
    }));
};

const isValid = fields =>
    !fields.some(field => field.duplicated || !field.name.trim());

const AvroSchema = forwardRef(
    (
        {
            onSave,
            setIsValid,
            className,
            schemaFields = DEFAULT_SCHEMA_FIELDS,
            filterable = true,
            editable = true
        },
        ref
    ) => {
        const classes = useStyles();
        const { t } = useTranslation();

        const [fields, setFields] = React.useState(
            (schemaFields.length === 0 ? DEFAULT_SCHEMA_FIELDS : schemaFields).map(
                toField
            )
        );
        const [criteria, setCriteria] = React.useState('');

        useImperativeHandle(ref, () => ({
            onSave() {
                onSave(fields.map(toSchema));
            }
        }));

        useEffect(() => {
            setIsValid(isValid(fields));
        }, [fields, setIsValid]);

        const onChangeHandler = index => event =>
            setFields(
                checkDuplicates(
                    update(fields, index, {
                        ...fields[index],
                        [event.target.name]: event.target.value
                    })
                )
            );

        const onAddRow = index => () =>
            setFields(
                checkDuplicates(
                    insert(fields, index, {
                        autoFocus: true,
                        ...toField(DEFAULT_SCHEMA_FIELDS[0])
                    })
                )
            );

        const onRemoveRow = index => () => {
            fields.length > 1 && setFields(checkDuplicates(remove(fields, index)));
        };

        const onMoveRowTop = index => () =>
            index !== 0 && setFields(swap(fields, index, index - 1));

        const onMoveRowDown = index => () =>
            index + 1 !== fields.length && setFields(swap(fields, index, index + 1));

        const onSearch = ({ target: { value } }) => setCriteria(value?.trim());

        const filteredFields = fields?.filter(field =>
            field.name?.toUpperCase()?.includes(criteria?.toUpperCase())
        );

        return (
            <Grid container direction="column" className={className}>
                {filterable && (
                    <Grid item className={classes.search} xs={4}>
                        <SearchInput
                            fullWidth
                            placeholder={t(
                                'jobDesigner:avroSchema.search.placeholder'
                            )}
                            onChange={onSearch}
                        />
                    </Grid>
                )}

                {filteredFields.map((field, index) => (
                    <Fade key={field.id} in>
                        <Grid item>
                            <Row
                                {...field}
                                index={index}
                                editable={editable}
                                shouldDisableDeleteBtn={filteredFields.length < 2}
                                onChange={onChangeHandler(index)}
                                onAdd={onAddRow(index)}
                                onRemove={onRemoveRow(index)}
                                onMoveDown={onMoveRowDown(index)}
                                onMoveTop={onMoveRowTop(index)}
                            />
                        </Grid>
                    </Fade>
                ))}
            </Grid>
        );
    }
);

AvroSchema.propTypes = {
    onSave: PropTypes.func.isRequired,
    setIsValid: PropTypes.func.isRequired,
    className: PropTypes.string,
    schemaFields: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string,
            type: PropTypes.oneOfType([
                PropTypes.oneOf(Object.values(types)),
                PropTypes.array
            ])
        })
    ).isRequired,
    filterable: PropTypes.bool,
    editable: PropTypes.bool
};

export default AvroSchema;
