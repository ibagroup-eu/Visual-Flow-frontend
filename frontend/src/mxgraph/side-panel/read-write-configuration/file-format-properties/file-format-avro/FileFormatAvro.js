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
import { get, unset } from 'lodash';
import { useTranslation } from 'react-i18next';
import { Button } from '@material-ui/core';
import SchemaModal from '../../../../../components/schema-modal';
import UseSchema from '../../helpers/UseSchema';
import FileFormatCommonFields from '../file-format-common-fields';
import useStyles from '../FileFormatProperties.Styles';

const optionAvroSchemaName = 'avroSchema';
const compressionItems = [
    { value: 'uncompressed', label: 'uncompressed' },
    { value: 'snappy', label: 'snappy' },
    { value: 'deflate', label: 'deflate' },
    { value: 'bzip2', label: 'bzip2' },
    { value: 'xz', label: 'xz' },
    { value: 'zstandard', label: 'zstandard' }
];

const FileFormatAvro = ({
    inputValues,
    handleInputChange,
    ableToEdit,
    openModal
}) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const [showSchemaModal, setShowSchemaModal] = useState(false);

    const useSchema = get(inputValues, 'useSchema', undefined);
    let optionAvroSchema = get(inputValues, optionAvroSchemaName);
    if (useSchema !== 'true' && optionAvroSchema !== null) {
        unset(inputValues, optionAvroSchemaName);
        optionAvroSchema = null;
    }

    return (
        <>
            <SchemaModal
                editable={ableToEdit}
                values={optionAvroSchema}
                onChange={handleInputChange}
                display={showSchemaModal}
                onClose={() => setShowSchemaModal(false)}
            />
            <UseSchema
                value={useSchema}
                onChange={event => handleInputChange(event)}
                ableToEdit={ableToEdit}
            />
            {useSchema === 'true' && (
                <Button
                    className={classes.divider}
                    variant="outlined"
                    onClick={() => setShowSchemaModal(true)}
                >
                    {t(
                        optionAvroSchema
                            ? 'main:button.EditSchema'
                            : 'main:button.UseSchema'
                    )}
                </Button>
            )}
            <FileFormatCommonFields
                inputValues={inputValues}
                handleInputChange={handleInputChange}
                ableToEdit={ableToEdit}
                openModal={openModal}
                compressionItems={compressionItems}
                defaultCompression="snappy"
            />
        </>
    );
};

FileFormatAvro.propTypes = {
    handleInputChange: PropTypes.func,
    ableToEdit: PropTypes.bool,
    inputValues: PropTypes.object,
    openModal: PropTypes.func
};

export default FileFormatAvro;
