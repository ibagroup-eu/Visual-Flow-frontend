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
import axios from 'axios';
import AuthRenderer from './AuthRenderer';

const Auth = ({ redirect, children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const { CancelToken } = axios;
        const source = CancelToken.source();
        axios
            .get(`${window.BASE_URL}profile`, {
                cancelToken: source.token
            })
            .then(response => setUser(response.data))
            .catch(thrown => {
                if (!axios.isCancel(thrown)) {
                    window.location.assign(
                        `${window.BASE_URL}login?redirect=${encodeURIComponent(
                            redirect
                        )}`
                    );
                }
            });
        return () => {
            source.cancel();
            setUser(null);
        };
    }, [redirect]);

    return <AuthRenderer authenticated={!!user}>{children}</AuthRenderer>;
};

Auth.propTypes = {
    children: PropTypes.node.isRequired,
    redirect: PropTypes.string.isRequired
};

export default Auth;
