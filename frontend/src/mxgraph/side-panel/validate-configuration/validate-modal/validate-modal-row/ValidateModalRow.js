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
import {
    Box,
    TableCell,
    IconButton,
    Typography,
    Collapse,
    List,
    Tooltip
} from '@material-ui/core';
import classNames from 'classnames';
import { ExpandMoreOutlined } from '@material-ui/icons';
import { truncate } from 'lodash';
import useStyles from './ValidateModalRow.Styles';
import ValidateColumnMenu from './validate-column-menu/ValidateColumnMenu';
import ValidateAddValidationButton from './validate-add-validation-button/ValidateAddValidationButton';
import ValidateTypeHeader from './validate-type-header/ValidateTypeHeader';
import ValidateModalRowValidation from './validate-modal-row-validation/ValidateModalRowValidation';

const ValidateModalRow = ({
    rowData,
    addValidation,
    deleteValidation,
    onSetRename,
    onDeleteColumn,
    editable,
    expand
}) => {
    const classes = useStyles();
    const [showMore, setShowMore] = useState(
        expand && rowData.validations.length !== 0
    );
    const [changeValidationIndex, onSetChangeValidation] = useState(null);

    useEffect(() => {
        if (rowData.validations.length === 0) {
            setShowMore(false);
        }
    }, [rowData.validations.length]);

    const onAddValidation = (data, changeIndex = null) => {
        addValidation(data, changeIndex);
        setShowMore(true);
    };

    const onExpandMore = () =>
        rowData.validations.length > 0 && setShowMore(!showMore);

    const onDeleteValidation = validationIndex => {
        deleteValidation(validationIndex);
    };

    return (
        <TableCell className={classes.cell}>
            <Box className={classes.columnRow}>
                <Box
                    className={classNames(
                        classes.columnHeader,
                        rowData.validations.length > 0 && classes.withPointer
                    )}
                >
                    <IconButton
                        disabled={rowData.validations.length === 0}
                        onClick={onExpandMore}
                        className={classNames(
                            classes.headerIcon,
                            !showMore && classes.headerIconClose
                        )}
                    >
                        <ExpandMoreOutlined />
                    </IconButton>
                    <Box className={classes.columnName}>
                        <Tooltip
                            arrow
                            title={rowData.column.length > 30 ? rowData.column : ''}
                        >
                            <Typography variant="h6" onClick={onExpandMore}>
                                {truncate(rowData.column, { length: 30 })}
                            </Typography>
                        </Tooltip>
                        <ValidateColumnMenu
                            className={classes.columnMenu}
                            onSetRename={onSetRename}
                            onDeleteColumn={onDeleteColumn}
                            editable={editable}
                        />
                    </Box>
                </Box>
                <ValidateAddValidationButton
                    addValidation={onAddValidation}
                    editable={editable}
                    validations={rowData.validations}
                    changeValidationIndex={changeValidationIndex}
                    cancelChangeValidation={() => onSetChangeValidation(null)}
                />
            </Box>
            <Collapse className={classes.collapse} in={showMore}>
                <ValidateTypeHeader />
                <List dense>
                    {rowData.validations.map((item, i) => (
                        <ValidateModalRowValidation
                            key={item.type}
                            data={item}
                            onDeleteValidation={() => onDeleteValidation(i)}
                            onChangeValidation={() => onSetChangeValidation(i)}
                            editable={editable}
                        />
                    ))}
                </List>
            </Collapse>
        </TableCell>
    );
};

ValidateModalRow.propTypes = {
    rowData: PropTypes.object,
    addValidation: PropTypes.func,
    deleteValidation: PropTypes.func,
    onSetRename: PropTypes.func,
    onDeleteColumn: PropTypes.func,
    editable: PropTypes.bool,
    expand: PropTypes.bool
};

export default ValidateModalRow;
