/* eslint-disable complexity */
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
import { isEmpty, isUndefined } from 'lodash';

import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Typography
} from '@material-ui/core';
import {
    ExpandMore,
    KeyboardArrowLeft,
    KeyboardArrowRight
} from '@material-ui/icons';

import PopupForm from '../popup-form';
import Exemplar from './Exemplar';
import Schemas from './Schemas';

import useStyles from './InteractiveMode.Styles';

const Modal = ({ open, onClose, operation, inputData, outputData, stageName }) => {
    const classes = useStyles();
    const { t } = useTranslation();

    const [openSidePanel, setOpenSidePanel] = useState(true);

    const exemplarColumns = [];

    outputData?.schema?.forEach(el => {
        exemplarColumns.push({
            id: el.field,
            // label: el.field[0].toUpperCase() + el.field.slice(1),
            label: el.field
        });
    });

    let exemplarRecords = [];

    // object to 'object'
    if (outputData?.exemplar?.records) {
        exemplarRecords = outputData.exemplar.records.map(item => {
            return Object.fromEntries(
                Object.entries(item).map(([key, value]) =>
                    typeof value === 'object' && value !== null
                        ? [key, 'object']
                        : [key, value]
                )
            );
        });
    }
    const rowCount = new Intl.NumberFormat('de-DE').format(outputData?.rowCount);

    const SidePanelItem = openSidePanel ? KeyboardArrowLeft : KeyboardArrowRight;

    return (
        <>
            <PopupForm
                className={classes.card}
                display={open}
                onClose={onClose}
                title={stageName}
                isNotHelper
            >
                <>
                    <Accordion className={classes.accordion}>
                        <AccordionSummary
                            expandIcon={<ExpandMore />}
                            aria-controls="schema"
                            id="index"
                        >
                            <Typography className={classes.generalSettings}>
                                {t('jobDesigner:interactiveMode.schemas')}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            {(!isEmpty(inputData) ||
                                !isUndefined(inputData) ||
                                !isEmpty(outputData?.schema)) && (
                                <Schemas
                                    inputData={inputData}
                                    outputData={outputData.schema}
                                    operation={operation}
                                />
                            )}
                        </AccordionDetails>
                    </Accordion>

                    <Accordion defaultExpanded className={classes.accordion}>
                        <AccordionSummary
                            expandIcon={<ExpandMore />}
                            aria-controls="exemplar"
                            id="exemplar"
                        >
                            <SidePanelItem
                                onClick={e => {
                                    e.stopPropagation();
                                    setOpenSidePanel(prev => !prev);
                                }}
                            />
                            <Typography className={classes.generalSettings}>
                                {t('jobDesigner:interactiveMode.exemplar')}
                            </Typography>
                            <Typography className={classes.accordionText}>
                                {`total row count: ${rowCount}`}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails className={classes.accDetails}>
                            {exemplarRecords && !isEmpty(exemplarRecords) && (
                                <Exemplar
                                    data={exemplarRecords}
                                    columns={exemplarColumns}
                                    openSidePanel={openSidePanel}
                                />
                            )}
                            {isEmpty(exemplarRecords) && 'There is nothing to show'}
                        </AccordionDetails>
                    </Accordion>
                </>
            </PopupForm>
        </>
    );
};

export default Modal;

Modal.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    operation: PropTypes.string,
    inputData: PropTypes.array,
    outputData: PropTypes.object,
    stageName: PropTypes.string
};
