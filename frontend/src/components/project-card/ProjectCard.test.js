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
import { ProjectCard, ProjectCardSkeleton } from './ProjectCard';
import Skeleton from '@material-ui/lab/Skeleton';
import { CardActionArea, CardHeader, IconButton } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';

describe('ProjectCard', () => {
    const init = (props = {}, returnProps = false, func = shallow) => {
        const defaultProps = {
            project: {
                id: 'id',
                name: 'name'
            },
            onClick: jest.fn(),
            superUser: true,
            confirmationWindow: jest.fn(),
            remove: jest.fn()
        };

        const wrapper = func(<ProjectCard {...defaultProps} {...props} />);

        return returnProps ? [wrapper, { ...defaultProps, ...props }] : [wrapper];
    };

    it('should render project skeleton', () => {
        expect(
            shallow(<ProjectCardSkeleton />)
                .find(Skeleton)
                .exists()
        ).toBeTruthy();
    });

    it('should render without crashes', () => {
        const [wrapper] = init();

        expect(wrapper.find(CardHeader).exists()).toBeTruthy();
        expect(wrapper.find(CardActionArea).exists()).toBeTruthy();
    });

    it('should not render delete functionality', () => {
        const [wrapper] = init({
            superUser: false
        });

        expect(
            wrapper
                .find(CardHeader)
                .find(DeleteIcon)
                .exists()
        ).toBeFalsy();
        expect(wrapper.find(CardActionArea).exists()).toBeTruthy();
    });

    it('should render delete functionality', () => {
        const [wrapper] = init(
            {
                superUser: true
            },
            false,
            mount
        );

        const deleteBtn = wrapper.find(IconButton);

        expect(deleteBtn.length).toBe(1);
        expect(deleteBtn.prop('aria-label')).toBe('Remove project');

        expect(wrapper.find(CardActionArea).exists()).toBeTruthy();
    });

    it('should not render lock icon if a user is superuser', () => {
        const [wrapper] = init(
            {
                superUser: true,
                project: {
                    id: 'id',
                    name: 'name',
                    locked: true
                }
            },
            false,
            mount
        );

        const deleteBtn = wrapper.find(IconButton);

        expect(deleteBtn.length).toBe(1);
        expect(deleteBtn.prop('aria-label')).toBe('Remove project');

        expect(wrapper.find(CardActionArea).exists()).toBeTruthy();
    });

    it('should not render lock icon', () => {
        const [wrapper] = init(
            {
                superUser: false,
                project: {
                    id: 'id',
                    name: 'name',
                    locked: false
                }
            },
            false,
            mount
        );

        const actionBtns = wrapper.find(IconButton);

        expect(actionBtns.length).toBe(0);

        expect(wrapper.find(CardActionArea).exists()).toBeTruthy();
    });

    it('should render lock icon', () => {
        const [wrapper] = init(
            {
                superUser: false,
                project: {
                    id: 'id',
                    name: 'name',
                    locked: true
                }
            },
            false,
            mount
        );

        const lockBtn = wrapper.find(IconButton);

        expect(lockBtn.length).toBe(1);
        expect(lockBtn.prop('aria-label')).toBe('Locked project');
    });

    it('should not render add a project button', () => {
        const [wrapper, props] = init({}, true);

        expect(
            wrapper
                .find(CardActionArea)
                .find(AddIcon)
                .exists()
        ).toBeFalsy();

        expect(wrapper.find(CardActionArea).text()).toBe(props.project.name);
    });

    it('should render add a project button', () => {
        const [wrapper] = init({
            project: { id: undefined }
        });

        expect(
            wrapper
                .find(CardActionArea)
                .find(AddIcon)
                .exists()
        ).toBeTruthy();
    });

    it('should handle confirmation window', () => {
        const [wrapper, props] = init({}, true);

        wrapper
            .find(CardHeader)
            .dive()
            .dive()
            .find(IconButton)
            .simulate('click');

        expect(props.confirmationWindow).toHaveBeenCalled();
    });
});
