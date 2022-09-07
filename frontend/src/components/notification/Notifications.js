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
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { removeSnackbar } from '../../redux/actions/notificationsActions';

let displayed = [];

const Notifications = () => {
    const dispatch = useDispatch();
    const notifications = useSelector(store => store.notifications || []);
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const storeDisplayed = id => {
        displayed = [...displayed, id];
    };

    const removeDisplayed = id => {
        displayed = [...displayed.filter(key => id !== key)];
    };

    React.useEffect(() => {
        notifications.forEach(
            ({ key, message, options = {}, dismissed = false }) => {
                if (dismissed) {
                    // dismiss snackbar using notistack
                    closeSnackbar(key);
                    return;
                }

                // do nothing if snackbar is already displayed
                if (displayed.includes(key)) {
                    return;
                }

                // display snackbar using notistack
                enqueueSnackbar(message, {
                    key,
                    ...options,
                    onClose: (event, reason, myKey) => {
                        if (options.onClose) {
                            options.onClose(event, reason, myKey);
                        }
                    },
                    onExited: (event, myKey) => {
                        // remove this snackbar from redux store
                        dispatch(removeSnackbar(myKey));
                        removeDisplayed(myKey);
                    }
                });

                // keep track of snackbars that we've displayed
                storeDisplayed(key);
            }
        );
    }, [notifications, closeSnackbar, enqueueSnackbar, dispatch]);

    return null;
};

export default Notifications;
