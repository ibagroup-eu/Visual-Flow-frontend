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
import { useTranslation } from 'react-i18next';
import { shallow } from 'enzyme';
import ReadWriteStage from './ReadWriteStage';
import { STORAGES } from '../../constants';

jest.mock('react-i18next', () => ({
    ...jest.requireActual('react-i18next'),
    useTranslation: jest.fn()
}));

describe('ReadWriteStage', () => {
    const init = () => {
        const defaultProps = {
            stage: {
                storage: STORAGES.AWS.value
            }
        };

        useTranslation.mockImplementation(() => ({ t: x => x }));

        return shallow(<ReadWriteStage {...defaultProps} />);
    };

    it('should render without crashes', () => {
        const wrapper = init();
        wrapper.setProps({
            stage: {
                storage: STORAGES.COS.value
            }
        });
        wrapper.setProps({
            stage: {
                storage: STORAGES.MONGO.value
            }
        });
        wrapper.setProps({
            stage: {
                storage: STORAGES.REDSHIFT.value
            }
        });
        wrapper.setProps({
            stage: {
                storage: STORAGES.CASSANDRA.value
            }
        });
        wrapper.setProps({
            stage: {
                storage: STORAGES.REDIS.value
            }
        });
        wrapper.setProps({
            stage: {
                storage: STORAGES.STDOUT.value
            }
        });
        wrapper.setProps({
            stage: {
                storage: STORAGES.ELASTIC.value
            }
        });
        wrapper.setProps({
            stage: {
                storage: STORAGES.DB2.value
            }
        });
        wrapper.setProps({
            stage: {
                storage: STORAGES.CLUSTER.value
            }
        });
        wrapper.setProps({
            stage: {
                storage: STORAGES.CLICKHOUSE.value
            }
        });
        wrapper.setProps({
            stage: {
                storage: STORAGES.DATAFRAME.value
            }
        });
        wrapper.setProps({
            stage: {
                storage: STORAGES.API.value
            }
        });
        wrapper.setProps({
            stage: {
                storage: STORAGES.AZURE.value
            }
        });
        wrapper.setProps({
            stage: {
                storage: STORAGES.GOOGLECLOUD.value
            }
        });
    });
});
