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
import {
    Button,
    DialogActions,
    Paper,
    Table,
    TableBody,
    TableContainer,
    withStyles
} from '@material-ui/core';
import { AddOutlined } from '@material-ui/icons';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { isEqual } from 'lodash';
import PropTypes from 'prop-types';
import PopupForm from '../../../components/popup-form';
import styles from './PropertyListModal.Styles';
import isBlank from '../../../utils/isBlank';
import PropertyListRow from './PropertyListRow';

const DEFAULT = [['', '']];

export const PropertyListModal = ({
    classes,
    items: initialItems = [],
    open,
    onClose,
    onSave,
    editable,
    modalTitle,
    buttonTitle,
    fieldName,
    options = []
}) => {
    const [items, setItems] = useState(initialItems);
    const { t } = useTranslation();

    const handleRemove = index => () =>
        setItems(prev => [...prev.slice(0, index), ...prev.slice(index + 1)]);

    const handleMove = index => () => {
        setItems(prev => {
            const result = [...prev];
            [result[index], result[index + 1]] = [result[index + 1], result[index]];
            return result;
        });
    };

    const handleItemChange = (index, value) => {
        setItems(prev => {
            const copy = [...prev];
            copy[index] = value;
            return copy;
        });
    };
    const disabled = !editable;

    const valid = !items.some(entry => entry.some(isBlank));

    const renderItem = ([key, value], index) => {
        return (
            <PropertyListRow
                key={index}
                index={index}
                size={items.length}
                disabled={disabled}
                keyName={key}
                keyValue={value}
                onChange={handleItemChange}
                onMove={handleMove}
                onRemove={handleRemove}
                fieldName={fieldName}
                options={options}
            />
        );
    };

    const onAddItem = () => {
        setItems(values => values.concat(DEFAULT));
    };

    return (
        <PopupForm
            className={classes.root}
            display={open}
            onClose={onClose}
            title={modalTitle}
            isNotHelper
        >
            <Button
                autoFocus
                disabled={disabled}
                className={classes.addButton}
                onClick={onAddItem}
                startIcon={<AddOutlined />}
            >
                {buttonTitle}
            </Button>
            <TableContainer component={Paper} className={classes.table}>
                <Table>
                    <TableBody>{items.map(renderItem)}</TableBody>
                </Table>
            </TableContainer>
            <DialogActions className={classes.buttonsGroup}>
                <Button
                    className={classes.button}
                    onClick={() => onSave(items)}
                    color="primary"
                    variant="contained"
                    disabled={disabled || !valid || isEqual(items, initialItems)}
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

PropertyListModal.propTypes = {
    items: PropTypes.array,
    classes: PropTypes.object,
    open: PropTypes.bool,
    onClose: PropTypes.func,
    onSave: PropTypes.func,
    editable: PropTypes.bool,
    modalTitle: PropTypes.string,
    buttonTitle: PropTypes.string,
    options: PropTypes.array,
    fieldName: PropTypes.string
};

export default withStyles(styles)(PropertyListModal);
