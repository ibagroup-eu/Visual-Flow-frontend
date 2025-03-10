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
import { Box, IconButton } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import PropTypes from 'prop-types';

const Actions = ({ onAdd, onRemove, className, shouldDisableDeleteBtn }) => (
    <Box display="flex" justifyContent="flex-end" className={className}>
        <IconButton aria-label="add" onClick={onAdd}>
            <AddIcon />
        </IconButton>
        <IconButton
            aria-label="delete"
            disabled={shouldDisableDeleteBtn}
            onClick={onRemove}
        >
            <DeleteOutlineIcon />
        </IconButton>
    </Box>
);

Actions.propTypes = {
    onAdd: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    className: PropTypes.string,
    shouldDisableDeleteBtn: PropTypes.bool
};

export default Actions;
