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
import { shallow, mount } from 'enzyme';
import { useTranslation } from 'react-i18next';
import { IconButton, Slider } from '@material-ui/core';
import PanToolIcon from '@material-ui/icons/PanTool';
import NearMeOutlinedIcon from '@material-ui/icons/NearMeOutlined';
import { Zoom } from './Zoom';

jest.mock('react-i18next', () => ({
    ...jest.requireActual('react-i18next'),
    useTranslation: jest.fn()
}));

const defaultProps = {
    graph: {
        zoomActual: jest.fn(),
        panningHandler: {
            useLeftButtonForPanning: true
        }
    },
    zoomVal: 1,
    zoom: jest.fn(),
    setZoomVal: jest.fn(),
    panning: true,
    setPan: jest.fn()
};

describe('Zoom', () => {
    let wrapper;

    beforeEach(() => {
        useTranslation.mockImplementation(() => ({ t: x => x }));

        wrapper = shallow(<Zoom {...defaultProps} />);
    });

    afterEach(() => useTranslation.mockClear());

    it('should render component', () => {
        expect(wrapper).toBeDefined();
    });

    it('should call useEffect', () => {
        const useEffectSpy = jest.spyOn(React, 'useEffect');

        wrapper = mount(<Zoom {...defaultProps} />);

        expect(useEffectSpy).toHaveBeenCalled();

        wrapper.unmount();

        expect(defaultProps.setZoomVal).toHaveBeenCalledWith(1);
        expect(defaultProps.setPan).toHaveBeenCalledWith(false);
    });

    it('should call restoreZoom', () => {
        const [, , button] = wrapper.find(IconButton).map(b => b);
        button.simulate('click');

        expect(defaultProps.setZoomVal).toHaveBeenCalled();
        expect(defaultProps.graph.zoomActual).toHaveBeenCalled();
    });

    it('should call panHandler', () => {
        const [, , , button] = wrapper.find(IconButton).map(b => b);
        button.simulate('click');

        expect(defaultProps.graph.panningHandler.useLeftButtonForPanning).toEqual(
            !defaultProps.panning
        );
        expect(defaultProps.setPan).toHaveBeenCalledWith(!defaultProps.panning);
    });

    it('should call zoom prop by zoomOut', () => {
        const [button] = wrapper.find(IconButton).map(b => b);
        button.simulate('click');

        expect(defaultProps.zoom).toHaveBeenCalledWith(defaultProps.zoomVal - 0.1);
    });

    it('should call zoom prop by Slider', () => {
        wrapper.find(Slider).prop('onChange')({}, 1.2);

        expect(defaultProps.zoom).toHaveBeenCalledWith(1.2);
    });

    it('should call zoom prop by zoomIn', () => {
        const [, button] = wrapper.find(IconButton).map(b => b);
        button.simulate('click');

        expect(defaultProps.zoom).toHaveBeenCalledWith(defaultProps.zoomVal + 0.1);
    });

    it('should render correct icon for different panning values', () => {
        expect(wrapper.find(NearMeOutlinedIcon)).toHaveLength(1);
        expect(wrapper.find(PanToolIcon)).toHaveLength(0);

        wrapper.setProps({
            panning: false
        });

        expect(wrapper.find(NearMeOutlinedIcon)).toHaveLength(0);
        expect(wrapper.find(PanToolIcon)).toHaveLength(1);
    });
});
