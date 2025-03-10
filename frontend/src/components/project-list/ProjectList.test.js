/*
 *  Copyright (c) 2021 IBA Group, a.s. All rights reserved.
 *
 *  Licensed to the Apache Software Foundation (ASF) under one or more
 *  contributor license agreements.  See the NOTICE file distributed with
 *  this work for additional information regarding copyright ownership.
 *  The ASF licenses this file to You under the Apache License, Version 2.0
 *  (the "License"); you may not use this file except in compliance with
 *  the License.  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import React from 'react';
import { mount, shallow } from 'enzyme';
import { ProjectList } from './ProjectList';
import { ProjectCardSkeleton } from '../project-card/ProjectCard';
import ProjectCard from '../project-card';
import { DATABRICKS } from '../../mxgraph/constants';

describe('ProjectList', () => {
    const init = (props = {}, returnProps = false, func = shallow) => {
        const defaultProps = {
            projects: {
                data: {
                    editable: true,
                    projects: []
                },
                loading: false
            },
            getProjects: jest.fn(),
            getCurrentUser: jest.fn()
        };

        const wrapper = func(<ProjectList {...defaultProps} {...props} />);

        return returnProps ? [wrapper, { ...defaultProps, ...props }] : [wrapper];
    };

    it('should render without crashes', () => {
        const [wrapper] = init({});

        expect(wrapper).toBeDefined();
    });

    it('should render skeleton cards', () => {
        const [wrapper] = init({
            projects: {
                data: {
                    editable: true,
                    projects: []
                },
                loading: true
            }
        });

        expect(wrapper.find(ProjectCardSkeleton).length).toBe(12);
    });

    it('should render project cards', () => {
        const [wrapper] = init({
            projects: {
                data: {
                    editable: true,
                    projects: [
                        {
                            id: 'id_1'
                        },
                        {
                            id: 'id_2'
                        }
                    ]
                },
                loading: false
            }
        });
        wrapper
            .find(ProjectCard)
            .at(0)
            .prop('onClick')();
        wrapper
            .find(ProjectCard)
            .at(1)
            .prop('onClick')();

        expect(wrapper.find(ProjectCard).length).toBe(3);
    });

    it('should not able to add new projects', () => {
        Object.defineProperty(window, 'PLATFORM', {
            value: DATABRICKS
        });

        const [wrapper] = init({
            projects: {
                data: {
                    editable: false,
                    projects: [
                        {
                            id: 'id_1'
                        },
                        {
                            id: 'id_2'
                        }
                    ]
                },
                loading: false
            },
            currentUser: {
                data: { superuser: true }
            }
        });

        expect(wrapper.find(ProjectCard).length).toBe(2);
        expect(
            wrapper
                .find(ProjectCard)
                .at(0)
                .prop('superUser')
        ).toBeTruthy();
    });

    it('should fetch projects', () => {
        const [wrapper] = init(
            {
                projects: {
                    data: {
                        editable: false,
                        projects: [
                            {
                                id: 'id_1'
                            }
                        ]
                    },
                    loading: true
                },
                currentUser: {
                    data: { superuser: true }
                }
            },
            false,
            mount
        );

        const getProjects = jest.fn();
        const getCurrentUser = jest.fn();

        wrapper.setProps({ getProjects, getCurrentUser });

        expect(getProjects).toHaveBeenCalled();
        expect(getCurrentUser).toHaveBeenCalled();
    });
});
