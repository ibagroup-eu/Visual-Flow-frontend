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
import classNames from 'classnames';
import {
    TableCell,
    TableRow,
    TextField,
    Radio,
    Tooltip,
    withStyles
} from '@material-ui/core';
import useStyles from './SingleSelectModalRow.Styles';

const PositionedTooltip = withStyles(() => ({
    tooltip: {
        top: -7
    }
}))(Tooltip);

const SingleSelectModalRow = ({
    ableToEdit,
    id,
    name,
    selectedValue,
    setSelectedValue,
    defaultSelected,
    tooltip
}) => {
    const { t } = useTranslation();
    const selectedRef = React.useRef(null);
    const classes = useStyles();
    const [tooltipOpened, setTooltipOpened] = React.useState(false);

    React.useEffect(() => {
        if (defaultSelected) {
            selectedRef?.current?.scrollIntoView();
        }
    }, [defaultSelected]);

    return (
        <TableRow
            ref={selectedValue === id ? selectedRef : null}
            key={id}
            onMouseEnter={() => setTooltipOpened(true)}
            onMouseLeave={() => setTooltipOpened(false)}
        >
            {(!!selectedValue || ableToEdit) && (
                <TableCell className={classes.cell}>
                    <PositionedTooltip title={tooltip} open={tooltipOpened} arrow>
                        <Radio
                            disabled={!ableToEdit}
                            className={classes.radioButtonCell}
                            checked={selectedValue === id}
                            onChange={event => setSelectedValue(event.target.value)}
                            value={id}
                            color="secondary"
                            onFocus={() => setTooltipOpened(true)}
                            onBlur={() => setTooltipOpened(false)}
                        />
                    </PositionedTooltip>
                </TableCell>
            )}
            <TableCell className={classNames(classes.cell, classes.nameCell)}>
                <TextField
                    disabled
                    variant="outlined"
                    fullWidth
                    value={name}
                    placeholder={t('pipelineDesigner:jobConfiguration.Name')}
                    InputProps={{
                        classes: {
                            disabled: classes.paper
                        }
                    }}
                />
            </TableCell>
        </TableRow>
    );
};

SingleSelectModalRow.propTypes = {
    ableToEdit: PropTypes.bool,
    id: PropTypes.string,
    name: PropTypes.string,
    selectedValue: PropTypes.string,
    setSelectedValue: PropTypes.func,
    defaultSelected: PropTypes.bool,
    tooltip: PropTypes.string
};

export default SingleSelectModalRow;
