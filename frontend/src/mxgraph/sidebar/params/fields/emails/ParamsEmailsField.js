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

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Chip, Popper, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { noop, get, isEmpty } from 'lodash';
import { connect } from 'react-redux';

import useStyles from './ParamsEmailsField.Styles';

export const ParamsEmailsField = ({
    name,
    value,
    label,
    onChange,
    ableToEdit,
    currentUserEmail,
    userEmails,
    loading,
    parentRef
}) => {
    const classes = useStyles();

    const handleChange = emails =>
        onChange({
            target: { name, value: emails },
            persist: noop
        });

    useEffect(() => {
        isEmpty(value) && currentUserEmail && handleChange([currentUserEmail]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Autocomplete
            PopperComponent={props => (
                <Popper
                    {...props}
                    popperOptions={{
                        positionFixed: true,
                        modifiers: {
                            preventOverflow: { enabled: false },
                            hide: {
                                enabled: false
                            }
                        }
                    }}
                    container={parentRef?.current}
                />
            )}
            className={classes.root}
            disabled={!ableToEdit}
            id="recipients"
            multiple
            freeSolo
            filterSelectedOptions
            autoSelect={false}
            loading={loading}
            options={userEmails || []}
            value={value || [currentUserEmail].filter(Boolean)}
            onChange={(_, emails) => handleChange(emails)}
            renderTags={(emails, getTagProps) =>
                emails?.map((option, index) => (
                    <Chip
                        variant="outlined"
                        label={option}
                        {...getTagProps({ index })}
                    />
                ))
            }
            renderInput={params => (
                <TextField {...params} fullWidth variant="outlined" label={label} />
            )}
        />
    );
};

ParamsEmailsField.propTypes = {
    name: PropTypes.string,
    value: PropTypes.arrayOf(PropTypes.string),
    label: PropTypes.string,
    onChange: PropTypes.func,
    ableToEdit: PropTypes.bool,
    currentUserEmail: PropTypes.string,
    userEmails: PropTypes.arrayOf(PropTypes.string),
    loading: PropTypes.bool,
    parentRef: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.shape({ current: PropTypes.instanceOf(Element) })
    ])
};

export const mapStateToProps = state => ({
    currentUserEmail: get(state.user.profile.data, 'emails[0].value'),
    userEmails: state.user.users.data.map(({ email }) => email),
    loading: state.user.users.loading
});

export default connect(mapStateToProps)(ParamsEmailsField);
