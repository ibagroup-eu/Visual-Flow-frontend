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
import _ from 'lodash';
import { Box, Paper, Table, TableBody, TableContainer } from '@material-ui/core';
import PopupForm from '../../../../components/popup-form';
import SearchInput from '../../../../components/search-input';
import { PageSkeleton } from '../../../../components/skeleton';
import useStyles from './SingleSelectModal.Styles';
import ModalConfirmButtons from '../../read-write-configuration/connections-modal/confirmButtons/ModalConfirmButtons';
import SingleSelectModalRow from './modal-row/SingleSelectModalRow';

const SingleSelectModal = ({
    title,
    ableToEdit,
    display,
    onClose,
    items,
    loading,
    currentValue,
    onSetValue
}) => {
    const { t } = useTranslation();
    const classes = useStyles();

    const [itemList, setItemList] = React.useState(_.sortBy(items, 'name'));
    const [searchValue, setSearchValue] = React.useState('');
    const [selectedValue, setSelectedValue] = React.useState('');

    React.useEffect(() => {
        setSelectedValue(currentValue);
        setItemList(_.sortBy(items, 'name'));
        setSearchValue('');
    }, [display, items]);

    const handleChangeSearch = value => {
        setSearchValue(value);
        setItemList(
            items.filter(
                item => item.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
            )
        );
    };

    return (
        <PopupForm display={display} onClose={onClose} title={title}>
            {loading ? (
                <PageSkeleton />
            ) : (
                <Box className={classes.wrapper}>
                    <Box className={classes.search}>
                        <SearchInput
                            fullWidth
                            value={searchValue}
                            onChange={event =>
                                handleChangeSearch(event.target.value)
                            }
                            placeholder={t('pipelineDesigner:jobModal.search')}
                        />
                    </Box>
                    <TableContainer
                        className={classes.listContent}
                        component={Paper}
                    >
                        <Table>
                            <TableBody>
                                {itemList.map(({ id, name }) => (
                                    <SingleSelectModalRow
                                        key={id}
                                        name={name}
                                        id={id}
                                        ableToEdit={ableToEdit}
                                        selectedValue={selectedValue}
                                        defaultSelected={currentValue === id}
                                        setSelectedValue={setSelectedValue}
                                    />
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <ModalConfirmButtons
                        ableToEdit={ableToEdit}
                        selectedValue={selectedValue}
                        onClose={onClose}
                        onSetValue={onSetValue}
                    />
                </Box>
            )}
        </PopupForm>
    );
};

SingleSelectModal.propTypes = {
    title: PropTypes.string,
    ableToEdit: PropTypes.bool,
    display: PropTypes.bool,
    onClose: PropTypes.func,
    onSetValue: PropTypes.func,
    currentValue: PropTypes.string,
    items: PropTypes.array,
    loading: PropTypes.bool
};

export default SingleSelectModal;
