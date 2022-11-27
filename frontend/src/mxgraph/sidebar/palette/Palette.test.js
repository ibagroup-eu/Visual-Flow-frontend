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

import { mount, shallow } from 'enzyme';
import React, { createRef } from 'react';
import { Grid } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import { Palette } from './Palette';
import StageModal from '../../../components/stage-modals/stage';

jest.mock('../../../unitConfig', () => ({
    JOB: { STAGES: {} },
    PIPELINE: { STAGES: {} }
}));

jest.mock('react', () => ({
    ...jest.requireActual('react'),
    createRef: jest.fn()
}));

describe('Palette', () => {
    let cryptoMock = null;
    let elementFromPointMock = null;
    let originalElementFromPoint = null;

    beforeEach(() => {
        window.crypto = cryptoMock = { getRandomValues: jest.fn() };

        originalElementFromPoint = document.elementFromPoint;
        document.elementFromPoint = elementFromPointMock = jest.fn();
    });

    afterEach(() => {
        window.crypto = null;

        document.elementFromPoint = originalElementFromPoint;
    });

    const init = (props = {}, returnProps = false, func = shallow) => {
        const defaultProps = {
            theme: {
                palette: {
                    info: {
                        light: '#F3EAFF',
                        background: '#E8F0FF'
                    },
                    secondary: {
                        light: '#D8FFF9'
                    },
                    warning: {
                        background: '#FFF5E3'
                    },
                    success: {
                        light: '#81C784',
                        background: '#F0FFED'
                    },
                    other: {
                        border: 'green'
                    }
                },
                zIndex: { drawer: 1200 }
            },
            classes: {},
            t: x => x,
            setDirty: jest.fn()
        };

        createRef.mockImplementation(() => ({
            current: { querySelectorAll: () => ({}) }
        }));

        const wrapper = func(<Palette {...defaultProps} {...props} />);

        return returnProps ? [wrapper, { ...defaultProps, ...props }] : [wrapper];
    };

    it('should make draggable', () => {
        const graph = {
            getDefaultParent: jest.fn(),
            insertVertex: jest.fn(),
            setSelectionCell: jest.fn()
        };

        const [wrapper] = init({ graph }, false, mount);

        wrapper.instance().graphF({});

        expect(elementFromPointMock).toHaveBeenCalled();
    });

    it('should render without crashes', () => {
        const [wrapper] = init();

        expect(wrapper.find(Grid).exists()).toBeTruthy();
    });

    it('should handle double click', () => {
        const graph = {
            getDefaultParent: jest.fn(),
            insertVertex: jest.fn(),
            setSelectionCell: jest.fn(),
            getView: jest.fn().mockImplementation(() => ({
                getTranslate: jest.fn().mockImplementation(() => ({
                    x: 0,
                    y: 0
                }))
            }))
        };

        const [wrapper, props] = init({ graph }, true);

        wrapper
            .find(Card)
            .at(0)
            .prop('onDoubleClick')();

        expect(cryptoMock.getRandomValues).toHaveBeenCalled();
        expect(props.setDirty).toHaveBeenCalledWith(true);
        expect(graph.getDefaultParent).toHaveBeenCalled();
        expect(graph.insertVertex).toHaveBeenCalled();
        expect(graph.setSelectionCell).toHaveBeenCalled();
    });

    it('should calls onClose prop for StageModal', () => {
        const [wrapper] = init();

        wrapper.find(StageModal).prop('onClose')();
    });

    it('should calls onClick prop for StageModal', () => {
        const [wrapper] = init();

        wrapper
            .find(InfoOutlinedIcon)
            .at(0)
            .prop('onClick')();
    });
});
