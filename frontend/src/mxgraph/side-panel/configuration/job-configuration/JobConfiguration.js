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

import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { useTheme } from '@material-ui/core';
import stageLabels from '../../../stageLabels';
import ConfigurationWrapper from '../configuration-wrapper/ConfigurationWrapper';
import Job from './Job';

export const getOutputPaths = graph => {
    const currentCell = graph.getSelectionCell();
    const outputEdges = graph.getOutgoingEdges(currentCell);

    return outputEdges
        ? outputEdges.map(edge => ({
              id: edge.id,
              successPath: get(edge, 'value.attributes.successPath.value', ''),
              job: get(edge, 'target.value.attributes.name.value', '')
          }))
        : [];
};

export const JobConfiguration = ({
    isDisabled,
    ableToEdit,
    configuration,
    saveCell,
    setPanelDirty,
    graph,
    state,
    setState
}) => {
    const [outputPaths, setOutputPaths] = React.useState([]);
    const theme = useTheme();

    useEffect(() => {
        setOutputPaths(getOutputPaths(graph));
    }, [graph]);

    const handleChangePathStatus = useCallback(
        (id, value) => {
            setOutputPaths(
                outputPaths.map(edge => ({
                    ...edge,
                    successPath: edge.id === id ? value : edge.successPath
                }))
            );
            setPanelDirty(outputPaths.find(e => e.id === id).successPath !== value);
        },
        [setOutputPaths, setPanelDirty, outputPaths]
    );

    const saveConfiguration = inputValues => {
        const current = graph.getSelectionCell();
        const outEdges = graph.getOutgoingEdges(current);

        outEdges.forEach(edge => {
            const currentOutputPath = outputPaths.find(item => item.id === edge.id);
            const outEdge = get(edge, 'value.attributes.successPath.value', '');
            if (currentOutputPath.successPath !== outEdge) {
                graph.model.setValue(
                    edge,
                    stageLabels({
                        operation: 'EDGE',
                        successPath: outputPaths.find(item => item.id === edge.id)
                            .successPath,
                        text: get(edge, 'value.attributes.text.value', '')
                    })
                );
                const edgeColor =
                    currentOutputPath.successPath === 'false'
                        ? theme.palette.error.light
                        : theme.palette.success.light;
                graph.setCellStyles('strokeColor', edgeColor, [edge]);
            }
        });
        return saveCell(inputValues);
    };

    const render = useCallback(
        props => (
            <Job
                {...props}
                outputPaths={outputPaths}
                onChangeOutputPaths={handleChangePathStatus}
            />
        ),
        [outputPaths, handleChangePathStatus]
    );
    return (
        <ConfigurationWrapper
            configuration={configuration}
            onSave={saveConfiguration}
            ableToEdit={ableToEdit}
            isDisabled={isDisabled}
            setPanelDirty={setPanelDirty}
            state={state}
            setState={setState}
            render={render}
            graph={graph}
        />
    );
};

JobConfiguration.propTypes = {
    isDisabled: PropTypes.func,
    ableToEdit: PropTypes.bool,
    configuration: PropTypes.object,
    saveCell: PropTypes.func,
    setPanelDirty: PropTypes.func,
    graph: PropTypes.object,
    state: PropTypes.object,
    setState: PropTypes.func
};

export default JobConfiguration;
