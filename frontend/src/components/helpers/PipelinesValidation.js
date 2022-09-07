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

export const findParamByKey = (objects, values) => {
    const valuesParam = values?.map(param => {
        if (param) {
            if (param.slice(-1) === '#' && param[0] === '#') {
                const newValue = param.slice(1, -1);
                return !!objects?.find(obj => obj.key === newValue);
            }

            return true;
        }

        return false;
    });

    return !valuesParam.includes(false);
};

export const validParamsContainer = (params, stage) => {
    if (!findParamByKey(params, [stage.image])) {
        return false;
    }

    if (
        stage.imagePullSecretType === 'PROVIDED' &&
        !findParamByKey(params, [stage.imagePullSecretName])
    ) {
        return false;
    }

    return !(
        stage.imagePullSecretType === 'NEW' &&
        !findParamByKey(params, [stage.username, stage.password, stage.registry])
    );
};
