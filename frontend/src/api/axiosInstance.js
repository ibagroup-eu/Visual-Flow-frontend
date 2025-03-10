/* eslint-disable no-nested-ternary */
/* eslint-disable spaced-comment */
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

import axios from 'axios';
import showNotification from '../components/notification/showNotification';
import i18n from '../i18n';

export const getLocation = (pathname, baseUrl) =>
    `${baseUrl}login?redirect=${encodeURIComponent(
        pathname.startsWith(baseUrl) ? pathname.slice(baseUrl.length) : pathname
    )}`;

export const login = () => {
    const pathname = window.location.pathname + window.location.search;
    window.location = getLocation(pathname, window.BASE_URL);
};

const chooseNotification = data => {
    const { message, error: err, errors } = data;
    errors && errors.length
        ? errors.forEach(el => showNotification(el.defaultMessage, 'error'))
        : showNotification(message || err || data, 'error');
};

const interceptors = {
    // eslint-disable-next-line complexity
    success: response => {
        if (
            response.config.params?.interactive ||
            (response.config.url.includes('session') &&
                response.config.method !== 'get' &&
                response.config.method !== 'delete')
        ) {
            showNotification(
                response.statusText === 'Created' && response.status === 201
                    ? i18n.t('main:interactiveNotifications.enabled')
                    : response.config.method === 'post' &&
                      response.config?.url.includes('/stop') &&
                      response.config.params?.interactive &&
                      response.status === 200
                    ? i18n.t('main:interactiveNotifications.disabled')
                    : response.config.method === 'post' &&
                      response.status === 200 &&
                      (response.config.data.includes('"command":"run"') ||
                          response.config.data.includes('"command":"run-all"'))
                    ? i18n.t('main:interactiveNotifications.running')
                    : response.statusText,
                'success'
            );
        } else if (
            response.config.method === 'delete' &&
            response.config.url.includes('session')
        ) {
            return response;
        } else if (response.config.method !== 'get') {
            showNotification(
                response.statusText === 'No Content'
                    ? i18n.t('main:Deleted')
                    : response.statusText,
                'success'
            );
        }
        return response;
    },
    error: error => {
        const { status, data, config } = error.response;

        const isGetSessionRequest =
            config.method === 'get' &&
            config.url.includes('/session/') &&
            !config.url.includes('/metadata');

        if (status === 404 && isGetSessionRequest) {
            return Promise.reject(error);
        }

        if (status === 401) {
            login();
        } else {
            config?.responseType === 'blob'
                ? data.text().then(message => chooseNotification({ message }))
                : chooseNotification(data);
        }

        return Promise.reject(error);
    }
};

const config = {
    baseURL: `${window.BASE_URL}backend/api`
};

export const axiosInstance = axios.create(config);

axiosInstance.interceptors.response.use(interceptors.success, interceptors.error);

export const axiosSimpleInstance = axios.create(config);

axiosSimpleInstance.interceptors.response.use(
    response => response,
    interceptors.error
);

export default axiosInstance;
