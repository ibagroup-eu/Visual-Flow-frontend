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
import { useTranslation } from 'react-i18next';
import { Button } from '@material-ui/core';
import useStyles from '../ReadWriteConfiguration.Styles';
import DataframeModal from '../../../../components/dataframe-modal';

const DataframeStorage = ({ inputValues, handleInputChange, ableToEdit }) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <DataframeModal
                rowsData={inputValues.data}
                schema={inputValues.schema}
                editable={ableToEdit}
                onChange={handleInputChange}
                display={showModal}
                onClose={() => setShowModal(false)}
            />
            <Button
                className={classes.dividerMargin16}
                variant="outlined"
                disabled={!ableToEdit && !!inputValues.data}
                onClick={() => setShowModal(true)}
            >
                {t(
                    `main:button.${
                        inputValues.data ? 'EditDataframe' : 'CreateDataframe'
                    }`
                )}
            </Button>
        </>
    );
};

DataframeStorage.propTypes = {
    inputValues: PropTypes.object,
    handleInputChange: PropTypes.func,
    ableToEdit: PropTypes.bool
};

export default DataframeStorage;
