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

import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Button, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { pickBy } from 'lodash';
import { connect } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import ReadTextFields from '../../../../components/rw-text-fields';

import AutocompleteParameter from '../../autocomplete-parameter';

import useStyles from './KafkaStorage.Styles';
import { PropertyListModal } from '../../property-list';
import FileTextField from '../../../../components/file-text-field';
import { uploadFile } from '../../../../redux/actions/filesActions';

import history from '../../../../utils/history';

const subscribeField = [{ field: 'subscribe' }];

const certificate = 'option.kafka.ssl.truststore.location';

const fields = [
    'name',
    'operation',
    'storage',
    'bootstrapServers',
    'subscribe',
    certificate
];
const prefix = 'option.kafka.';

const optionsList = [
    'allow.auto.create.topics',
    'auto.commit.interval.ms',
    'auto.offset.reset',
    'bootstrap.servers',
    'check.crcs',
    'client.dns.lookup',
    'client.id',
    'client.rack',
    'connections.max.idle.ms',
    'default.api.timeout.ms',
    'enable.auto.commit',
    'exclude.internal.topics',
    'fetch.max.bytes',
    'fetch.max.wait.ms',
    'fetch.min.bytes',
    'group.id',
    'group.instance.id',
    'heartbeat.interval.ms',
    'interceptor.classes',
    'internal.leave.group.on.close',
    'internal.throw.on.fetch.stable.offset.unsupported',
    'isolation.level',
    'key.deserializer',
    'max.partition.fetch.bytes',
    'max.poll.interval.ms',
    'max.poll.records',
    'metadata.max.age.ms',
    'metric.reporters',
    'metrics.num.samples',
    'metrics.recording.level',
    'metrics.sample.window.ms',
    'partition.assignment.strategy',
    'receive.buffer.bytes',
    'reconnect.backoff.max.ms',
    'reconnect.backoff.ms',
    'request.timeout.ms',
    'retry.backoff.ms',
    'sasl.client.callback.handler.class',
    'sasl.jaas.config',
    'sasl.kerberos.kinit.cmd',
    'sasl.kerberos.min.time.before.relogin',
    'sasl.kerberos.service.name',
    'sasl.kerberos.ticket.renew.jitter',
    'sasl.kerberos.ticket.renew.window.factor',
    'sasl.login.callback.handler.class',
    'sasl.login.class',
    'sasl.login.refresh.buffer.seconds',
    'sasl.login.refresh.min.period.seconds',
    'sasl.login.refresh.window.factor',
    'sasl.login.refresh.window.jitter',
    'sasl.mechanism',
    'security.protocol',
    'security.providers',
    'send.buffer.bytes',
    'session.timeout.ms',
    'socket.connection.setup.timeout.max.ms',
    'socket.connection.setup.timeout.ms',
    'ssl.cipher.suites',
    'ssl.enabled.protocols',
    'ssl.endpoint.identification.algorithm',
    'ssl.engine.factory.class',
    'ssl.key.password',
    'ssl.keymanager.algorithm',
    'ssl.keystore.certificate.chain',
    'ssl.keystore.key',
    'ssl.keystore.location',
    'ssl.keystore.password',
    'ssl.keystore.type',
    'ssl.protocol',
    'ssl.provider',
    'ssl.secure.random.implementation',
    'ssl.trustmanager.algorithm',
    'ssl.truststore.certificates',
    'ssl.truststore.location',
    'ssl.truststore.password',
    'ssl.truststore.type',
    'value.deserializer'
];

export const fromState = state =>
    Object.entries(state)
        .filter(([key]) => !fields.includes(key) && key.startsWith(prefix))
        .map(([key, value]) => [key.replace(prefix, ''), value]);

export const toState = entries =>
    Object.fromEntries(entries.map(([key, value]) => [`${prefix}${key}`, value])) ||
    null;

const KafkaStorage = ({
    inputValues,
    handleInputChange,
    setState,
    openModal,
    ableToEdit,
    connection,
    uploadLocalFile,
    error
}) => {
    const classes = useStyles();

    const currentProject = history.location.pathname.split('/')[2];
    const id = uuidv4();
    const [showModal, setShowModal] = useState(false);

    const { t } = useTranslation();

    React.useEffect(() => {
        if (error) {
            handleInputChange({
                target: {
                    name: certificate,
                    value: ''
                }
            });
        }
    }, [error, handleInputChange]);

    const handleOptionsSave = entries => {
        const options = toState(entries);
        setState(prev => {
            const state = pickBy(prev, (_, key) => fields.includes(key));
            return { ...state, ...options };
        });
        setShowModal(false);
    };

    const uploadCertificate = fileData => {
        const value = `/${currentProject}/${id}/${fileData.name.replace(
            /[,()[\]{}\s]/g,
            '_'
        )}`;
        const formData = new FormData();
        formData.append('fileToUpload', fileData);
        uploadLocalFile(currentProject, value, formData);

        handleInputChange({
            target: {
                name: certificate,
                value
            }
        });
    };

    return (
        <>
            <AutocompleteParameter
                className={classes.servers}
                ableToEdit={ableToEdit}
                id="bootstrapServers"
                name="bootstrapServers"
                handleInputChange={handleInputChange}
                state={inputValues}
                label={t('jobDesigner:kafkaConfiguration.bootstrapServers')}
                required
            />
            <Typography variant="caption" className={classes.hint}>
                {t('jobDesigner:kafkaConfiguration.hint')}
            </Typography>
            <ReadTextFields
                ableToEdit={ableToEdit}
                fields={subscribeField}
                inputValues={inputValues}
                handleInputChange={handleInputChange}
                openModal={openModal}
                connection={connection}
                required
            />
            <FileTextField
                setFile={fileData => uploadCertificate(fileData)}
                name={certificate}
                value={inputValues[certificate]?.split('/').slice(-1)[0]}
                ableToEdit={ableToEdit}
                handleInputChange={handleInputChange}
                label={t('jobDesigner:readConfiguration.truststore')}
                uploadStage
                clearable
            />

            {showModal && (
                <PropertyListModal
                    modalTitle={t('jobDesigner:kafkaConfiguration.configureOptions')}
                    buttonTitle={t('main:button.AddOption')}
                    fieldName={t('setting:parameter.Name')}
                    items={fromState(inputValues)}
                    editable={ableToEdit}
                    open={showModal}
                    onClose={() => setShowModal(false)}
                    onSave={handleOptionsSave}
                    options={optionsList}
                />
            )}
            <Button
                variant="outlined"
                className={classes.btn}
                disabled={!ableToEdit}
                onClick={() => setShowModal(true)}
            >
                {fromState(inputValues).length
                    ? t('jobDesigner:kafkaConfiguration.editOptions')
                    : t('jobDesigner:kafkaConfiguration.configureOptions')}
            </Button>
        </>
    );
};

KafkaStorage.propTypes = {
    inputValues: PropTypes.object,
    handleInputChange: PropTypes.func,
    openModal: PropTypes.func,
    ableToEdit: PropTypes.bool,
    setState: PropTypes.func,
    connection: PropTypes.object,
    uploadLocalFile: PropTypes.func,
    error: PropTypes.object
};

const mapStateToProps = state => ({
    error: state.files.error
});

const mapDispatchToProps = {
    uploadLocalFile: uploadFile
};

export default connect(mapStateToProps, mapDispatchToProps)(KafkaStorage);
