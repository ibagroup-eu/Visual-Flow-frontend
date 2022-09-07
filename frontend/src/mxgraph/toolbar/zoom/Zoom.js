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

import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Tooltip, Typography } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import RemoveIcon from '@material-ui/icons/Remove';
import Slider from '@material-ui/core/Slider';
import AddIcon from '@material-ui/icons/Add';
import ZoomOutMapIcon from '@material-ui/icons/ZoomOutMap';
import PanToolIcon from '@material-ui/icons/PanTool';
import NearMeOutlinedIcon from '@material-ui/icons/NearMeOutlined';

import { useTranslation } from 'react-i18next';
import useStyles from './Zoom.Styles';
import { setPanning, setZoomValue } from '../../../redux/actions/mxGraphActions';

const marks = [
    {
        value: 0.5,
        label: '50'
    },
    {
        value: 1,
        label: '100'
    },
    {
        value: 1.5,
        label: '150'
    }
];

const Zoom = ({ graph, zoomVal, zoom, setZoomVal, panning, setPan }) => {
    const { t } = useTranslation();
    const classes = useStyles();

    useEffect(
        () => () => {
            setZoomVal(1);
            setPan(false);
        },
        []
    );

    const restoreZoom = () => {
        setZoomVal(1);
        graph.zoomActual();
    };

    const panHandler = () => {
        // eslint-disable-next-line no-param-reassign
        graph.panningHandler.useLeftButtonForPanning = !panning;
        setPan(!panning);
    };

    return (
        <div className={classes.zoom}>
            <Typography variant="body2">{t('jobDesigner:Zoom.Zoom')}:</Typography>
            <IconButton aria-label="zoomOutIcon" onClick={() => zoom(zoomVal - 0.1)}>
                <Tooltip title={t('jobDesigner:Zoom.Out')} arrow>
                    <RemoveIcon />
                </Tooltip>
            </IconButton>
            <Slider
                min={0.5}
                max={1.5}
                defaultValue={1}
                value={zoomVal}
                marks={marks}
                step={0.1}
                onChange={(e, value) => zoom(value)}
            />
            <IconButton aria-label="zoomInIcon" onClick={() => zoom(zoomVal + 0.1)}>
                <Tooltip title={t('jobDesigner:Zoom.In')}>
                    <AddIcon />
                </Tooltip>
            </IconButton>
            <IconButton aria-label="zoomOutMapIcon" onClick={restoreZoom}>
                <Tooltip title={t('jobDesigner:Zoom.Restore')}>
                    <ZoomOutMapIcon />
                </Tooltip>
            </IconButton>
            <IconButton aria-label="PanToolIcon" onClick={panHandler}>
                {panning ? (
                    <Tooltip title={t('jobDesigner:Zoom.Select')}>
                        <NearMeOutlinedIcon />
                    </Tooltip>
                ) : (
                    <Tooltip title={t('jobDesigner:Zoom.Move')}>
                        <PanToolIcon />
                    </Tooltip>
                )}
            </IconButton>
        </div>
    );
};

Zoom.propTypes = {
    graph: PropTypes.object,
    zoomVal: PropTypes.number,
    setZoomVal: PropTypes.func,
    panning: PropTypes.bool,
    setPan: PropTypes.func,
    zoom: PropTypes.func
};

const mapStateToProps = state => ({
    zoomVal: state.mxGraph.zoomValue,
    panning: state.mxGraph.panning
});

const mapDispatchToProps = {
    setZoomVal: setZoomValue,
    setPan: setPanning
};
export default connect(mapStateToProps, mapDispatchToProps)(Zoom);
