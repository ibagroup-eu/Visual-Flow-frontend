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

import React, { useState, useRef, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, Box } from '@material-ui/core';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';

import useStyles from './SchemaModal.Styles';
import PopupForm from '../popup-form';
import AvroSchema from '../avro-schema';

const SchemaModal = ({ values, onChange, display, onClose, editable = true }) => {
    const classes = useStyles();
    const { t } = useTranslation();
    const avroSchema = useRef(null);

    const DEFAULT_SCHEMA = useMemo(() => {
        return {
            type: 'record',
            name: `schema_${uuidv4().replaceAll('-', '')}`,
            fields: [],
            ...JSON.parse(values || '{}')
        };
    }, [values]);

    const [schema, setSchema] = useState(DEFAULT_SCHEMA);
    const [isValid, setIsValid] = useState(false);

    useEffect(() => {
        setSchema(DEFAULT_SCHEMA);
    }, [DEFAULT_SCHEMA]);

    const onCancel = () => {
        setSchema(DEFAULT_SCHEMA);

        onClose();
    };

    const onSave = updatedFields => {
        const updatedSchema = {
            ...schema,
            fields: updatedFields
        };
        setSchema(updatedSchema);
        onChange({
            target: {
                name: 'avroSchema',
                value: JSON.stringify(updatedSchema)
            }
        });

        onClose();
    };

    const handleSave = () => {
        avroSchema.current.onSave();
    };

    return (
        <PopupForm
            display={display}
            title={t('jobDesigner:avroSchema.modal.title')}
            onClose={onClose}
            isNotHelper
        >
            <AvroSchema
                onSave={onSave}
                setIsValid={setIsValid}
                schemaFields={schema.fields}
                editable={editable}
                ref={avroSchema}
            />
            <Box className={classes.buttonsGroup}>
                {editable && (
                    <Button
                        disabled={!isValid}
                        className={classes.button}
                        variant="contained"
                        color="primary"
                        onClick={handleSave}
                    >
                        {t('main:button.Save')}
                    </Button>
                )}

                <Button
                    className={classNames(classes.button, classes.cancelBtn)}
                    variant="contained"
                    onClick={onCancel}
                >
                    {t('main:button.Cancel')}
                </Button>
            </Box>
        </PopupForm>
    );
};

SchemaModal.propTypes = {
    values: PropTypes.string,
    onChange: PropTypes.func,
    display: PropTypes.bool,
    onClose: PropTypes.func,
    editable: PropTypes.bool
};

export default SchemaModal;
