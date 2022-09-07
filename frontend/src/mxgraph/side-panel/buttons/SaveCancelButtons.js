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

import { Button } from '@material-ui/core';
import classNames from 'classnames';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import useStyles from './SaveCancelButtons.Styles';
import { setSidePanel } from '../../../redux/actions/mxGraphActions';
import toggleConfirmationWindow from '../../../redux/actions/modalsActions';

const SaveCancelButtons = ({
    saveCell,
    isDisabled,
    closeSidePanel,
    cancelChanges,
    ableToEdit,
    isModal,
    sidePanelIsDirty,
    confirmationWindow
}) => {
    const { t } = useTranslation();
    const classes = useStyles();

    return (
        <div className={classes.buttons}>
            {ableToEdit && (
                <Button
                    onClick={saveCell}
                    size="large"
                    variant="contained"
                    color="primary"
                    disabled={isDisabled}
                    className={classes.button}
                >
                    {t('main:button.Confirm')}
                </Button>
            )}
            <Button
                onClick={() => {
                    if (sidePanelIsDirty) {
                        confirmationWindow({
                            body: `${t(
                                'main:unsavedChanges.leaveWithUnsavedChanges'
                            )}`,
                            callback: () => {
                                !isModal && closeSidePanel(false);
                                cancelChanges();
                            }
                        });
                    } else {
                        !isModal && closeSidePanel(false);
                        cancelChanges();
                    }
                }}
                size="large"
                variant="contained"
                className={classNames(classes.button, classes.cancelBtn)}
            >
                {t('main:button.Discard')}
            </Button>
        </div>
    );
};

SaveCancelButtons.propTypes = {
    ableToEdit: PropTypes.bool,
    saveCell: PropTypes.func,
    isDisabled: PropTypes.bool,
    closeSidePanel: PropTypes.func,
    cancelChanges: PropTypes.func,
    isModal: PropTypes.bool,
    sidePanelIsDirty: PropTypes.bool,
    confirmationWindow: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    sidePanelIsDirty: state.mxGraph.sidePanelIsDirty
});

const mapDispatchToProps = {
    closeSidePanel: setSidePanel,
    confirmationWindow: toggleConfirmationWindow
};

export default connect(mapStateToProps, mapDispatchToProps)(SaveCancelButtons);
