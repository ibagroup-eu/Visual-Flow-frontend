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

export const isCorrectName = value =>
    /^[A-Za-z0-9-_ ]{3,40}$/.test(value) || value.length === 0;

export const isCorrectDescription = value => value.length <= 500;

export const isPositiveNumber = value => value > 0;

export const isValidDemoLimitDate = value => {
    const currentTimestamp = new Date().getTime();
    const futureTimestamp = new Date(value).getTime();
    if (
        /^\d{4}[-](0?[1-9]|1[0-2])[-](0?[1-9]|[1-2][0-9]|3[01])$/.test(value) &&
        currentTimestamp < futureTimestamp
    ) {
        return true;
    }
    return false;
};

export const isCorrectHost = value =>
    /^(https:\/\/)?((([a-z\d-]*)\.)+(cloud\.databricks\.com|azuredatabricks\.net|gcp\.databricks\.com))$/.test(
        value
    ) || value.length === 0;

export const isCorrectPath = value =>
    (value && /^\/Volumes\/(?:[A-Za-z0-9\-_]+\/){2,}[A-Za-z0-9\-_]+$/.test(value)) ||
    value.length === 0;

export const isValidDatabricksParams = ({
    host,
    token,
    clientId,
    secret,
    authenticationType,
    pathToFile
}) => {
    const fullValidHost = host && isCorrectHost(host);

    const fullValidToken = token && isCorrectName(token);

    const fullValidPath = pathToFile && isCorrectPath(pathToFile);

    if (authenticationType === 'OAUTH') {
        return fullValidHost && clientId && secret && fullValidPath;
    }

    if (authenticationType === 'PAT') {
        return fullValidHost && fullValidToken && fullValidPath;
    }

    return false;
};
