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

import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import {
    TableCell,
    TableRow,
    TextField,
    Radio,
    IconButton,
    Collapse,
    Box,
    ListItem,
    List
} from '@material-ui/core';

import { ExpandMore } from '@material-ui/icons';
import { isEqual, map } from 'lodash';
import useStyles from './ConnectionsModalTableRow.Styles';
import { valueIsLink } from '../../../../../components/rw-text-fields/ReadWriteTextField';
import SecretField from '../secretField/ConnectionsModalSecretField';
import { secretFields } from '../../../constants/container';

const ConnectionsModalTableRow = ({
    ableToEdit,
    connection,
    selectedValue,
    setSelectedValue,
    params,
    defaultSelected
}) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const selectedRef = useRef(null);
    const [open, setOpen] = useState(false);
    const {
        connectionName,
        storageLabel,
        storage,
        id,
        dependentJobIDs,
        ...rest
    } = connection;

    useEffect(() => {
        if (defaultSelected) {
            selectedRef?.current?.scrollIntoView();
        }
    }, [defaultSelected]);

    const withRest = !isEqual(rest, {});

    return (
        <TableRow ref={defaultSelected ? selectedRef : null}>
            <TableCell className={classNames(classes.column, classes.tableCell)}>
                <Box className={classes.row}>
                    {(!!selectedValue || ableToEdit) && (
                        <Box className={classes.cell}>
                            <Radio
                                disabled={!ableToEdit}
                                className={classes.buttonCell}
                                checked={selectedValue === connectionName}
                                onChange={event =>
                                    setSelectedValue(event.target.value)
                                }
                                value={connectionName}
                                color="secondary"
                            />
                        </Box>
                    )}
                    <Box className={classNames(classes.cell, classes.keyCell)}>
                        <TextField
                            disabled
                            fullWidth
                            variant="outlined"
                            value={storageLabel}
                            placeholder={t('setting:connection.Storage')}
                            label={t('setting:connection.Storage')}
                            classes={{ root: classes.paper }}
                        />
                    </Box>
                    <Box className={classNames(classes.cell, classes.valueCell)}>
                        <TextField
                            disabled
                            fullWidth
                            variant="outlined"
                            value={connectionName}
                            placeholder={t('setting:connection.Name')}
                            label={t('setting:connection.Name')}
                            classes={{ root: classes.paper }}
                        />
                    </Box>
                    <Box className={classes.cell}>
                        <IconButton
                            disabled={!withRest}
                            className={classNames(
                                classes.buttonCell,
                                open ? classes.closeRest : classes.openRest
                            )}
                            onClick={() => setOpen(!open)}
                        >
                            <ExpandMore />
                        </IconButton>
                    </Box>
                </Box>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List
                        className={classNames(classes.rest, classes.paper, {
                            [classes.restNotEditable]: !ableToEdit && !selectedValue
                        })}
                    >
                        {map(rest, (value, key) => (
                            <ListItem key={key} className={classes.restInputPadding}>
                                <SecretField
                                    value={
                                        valueIsLink(value)
                                            ? params.find(
                                                  param =>
                                                      param.key ===
                                                      value.slice(1, -1)
                                              )?.value
                                            : value
                                    }
                                    name={`${t(
                                        `jobDesigner:readConfiguration.${key.replace(
                                            /[\s.]/g,
                                            ''
                                        )}`
                                    )}:`}
                                    secret={secretFields.includes(key)}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Collapse>
            </TableCell>
        </TableRow>
    );
};

ConnectionsModalTableRow.propTypes = {
    ableToEdit: PropTypes.bool,
    connection: PropTypes.object,
    selectedValue: PropTypes.string,
    setSelectedValue: PropTypes.func,
    params: PropTypes.array,
    defaultSelected: PropTypes.bool
};

export default ConnectionsModalTableRow;
