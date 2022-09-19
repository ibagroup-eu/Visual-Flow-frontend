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
import PropTypes from 'prop-types';

import ReadWriteConfiguration from '../read-write-configuration';
import UnionConfiguration from '../union-configuration';
import EdgeConfiguration from '../edge-configuration';
import JoinConfiguration from '../join-configuration';
import CDCConfiguration from '../cdc-configuration';
import GroupByConfiguration from '../groupby-configuration';
import RemoveDuplicatesConfiguration from '../remove-duplicates-configuration';
import Configuration from '../configuration';
import TransformConfiguration from '../transform-configuration';
import FilterConfiguration from '../filter-configuration';
import CacheConfiguration from '../cache-configuration';
import SortConfiguration from '../sort-configuration';
import SliceConfiguration from '../slice-configuration';
import { STORAGES } from '../../constants';

const MIN_QUANTITY = 1;
const MAX_QUANTITY = 2147483631;

const isTruncateStorageDB2 = storage =>
    [
        STORAGES.DB2.value,
        STORAGES.POSTGRE.value,
        STORAGES.ORACLE.value,
        STORAGES.MYSQL.value,
        STORAGES.MSSQL.value,
        STORAGES.REDSHIFTJDBC.value
    ].includes(storage);

// eslint-disable-next-line complexity
export const checkReadWriteFields = ({
    name,
    storage,
    anonymousAccess,
    quantity,
    writeMode,
    truncateMode
}) => {
    if (!name || !storage) {
        return true;
    }
    if (storage === 's3' && !anonymousAccess) {
        return true;
    }
    if (
        storage === 'stdout' &&
        (!quantity || quantity < MIN_QUANTITY || quantity > MAX_QUANTITY)
    ) {
        return true;
    }
    return (
        isTruncateStorageDB2(storage) && writeMode === 'Overwrite' && !truncateMode
    );
};

export const checkTransformerFields = ({ name, mode, tableName, statement }) => {
    if (!name || !statement || !mode) {
        return true;
    }
    if (mode === 'Full_SQL' && !tableName) {
        return true;
    }
    return false;
};

export const checkSortFields = state =>
    !state.name ||
    !state.sortType ||
    !/^[^,]+?:/.test(state.orderColumns) ||
    /,:/.test(state.orderColumns);

export const checkGroupByFields = state =>
    !state.name ||
    !state.groupingColumns ||
    !state.groupingCriteria ||
    !!state.groupingCriteria
        ?.split(',')
        .find(column => !/.+?:.+?/.test(column.trim()));

export const checkRemoveDuplicateFields = state =>
    !state.name ||
    !state.keyColumns ||
    !state.orderColumns ||
    !!state.orderColumns?.split(',').find(column => !/.+?:.+?/.test(column.trim()));

const RenderJobConfiguration = ({
    configuration,
    setPanelDirty,
    graph,
    ableToEdit,
    saveCell,
    swapEdges,
    selectedStorage
}) => {
    const jobsConfigurationComponents = {
        EDGE: {
            component: EdgeConfiguration,
            props: {
                ableToEdit,
                setPanelDirty,
                configuration,
                saveCell,
                sourceAndTarget: graph.getSelectionCell
            }
        },
        READ: {
            component: Configuration,
            props: {
                Component: ReadWriteConfiguration,
                isDisabled: checkReadWriteFields,
                ableToEdit,
                setPanelDirty,
                configuration,
                saveCell,
                graph,
                selectedStorage
            }
        },
        WRITE: {
            component: Configuration,
            props: {
                Component: ReadWriteConfiguration,
                isDisabled: checkReadWriteFields,
                ableToEdit,
                setPanelDirty,
                configuration,
                saveCell,
                graph,
                selectedStorage
            }
        },
        GROUP: {
            component: Configuration,
            props: {
                Component: GroupByConfiguration,
                isDisabled: checkGroupByFields,
                ableToEdit,
                setPanelDirty,
                configuration,
                saveCell,
                graph
            }
        },
        REMOVE_DUPLICATES: {
            component: Configuration,
            props: {
                Component: RemoveDuplicatesConfiguration,
                isDisabled: checkRemoveDuplicateFields,
                ableToEdit,
                setPanelDirty,
                configuration,
                saveCell,
                graph
            }
        },
        JOIN: {
            component: Configuration,
            props: {
                Component: JoinConfiguration,
                isDisabled: state =>
                    !state.name ||
                    !state.joinType ||
                    (!state.columns && state.joinType !== 'cross'),
                ableToEdit,
                setPanelDirty,
                configuration,
                saveCell,
                swapEdges,
                graph
            }
        },
        CDC: {
            component: Configuration,
            props: {
                Component: CDCConfiguration,
                isDisabled: state => !state.name || !state.keyColumns,
                ableToEdit,
                setPanelDirty,
                configuration,
                saveCell,
                swapEdges,
                graph
            }
        },
        UNION: {
            component: Configuration,
            props: {
                Component: UnionConfiguration,
                isDisabled: state => !state.name || !state.type,
                ableToEdit,
                setPanelDirty,
                configuration,
                saveCell,
                graph
            }
        },
        TRANSFORM: {
            component: Configuration,
            props: {
                Component: TransformConfiguration,
                isDisabled: checkTransformerFields,
                ableToEdit,
                setPanelDirty,
                configuration,
                saveCell,
                graph
            }
        },
        FILTER: {
            component: Configuration,
            props: {
                Component: FilterConfiguration,
                isDisabled: state => !state.name || !state.condition,
                ableToEdit,
                setPanelDirty,
                configuration,
                saveCell,
                graph
            }
        },
        CACHE: {
            component: Configuration,
            props: {
                Component: CacheConfiguration,
                isDisabled: state => !state.name,
                ableToEdit,
                setPanelDirty,
                configuration,
                saveCell,
                graph
            }
        },
        SLICE: {
            component: Configuration,
            props: {
                Component: SliceConfiguration,
                isDisabled: state => !state.name || !state.mode || !state.columns,
                ableToEdit,
                setPanelDirty,
                configuration,
                saveCell,
                graph
            }
        },
        SORT: {
            component: Configuration,
            props: {
                Component: SortConfiguration,
                isDisabled: checkSortFields,
                ableToEdit,
                setPanelDirty,
                configuration,
                saveCell,
                graph
            }
        }
    };

    if (configuration.operation) {
        const { component: Component, props } = jobsConfigurationComponents[
            configuration.operation
        ];
        return <Component {...props} />;
    }

    return null;
};

RenderJobConfiguration.propTypes = {
    configuration: PropTypes.object,
    setPanelDirty: PropTypes.func,
    graph: PropTypes.object,
    ableToEdit: PropTypes.bool,
    saveCell: PropTypes.func,
    swapEdges: PropTypes.func,
    selectedStorage: PropTypes.func
};

export default RenderJobConfiguration;
