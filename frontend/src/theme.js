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

import { createTheme } from '@material-ui/core/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#546E7A',
            light: '#607D8B',
            dark: '#455A64',
            background: 'rgba(245, 249, 244, 0.8)',
            border: '#8799FA'
        },
        info: {
            main: '#5B6DD1',
            light: '#F3EAFF',
            background: '#E8F0FF',
            text: '#64B5F6'
        },
        secondary: {
            main: '#17D9C2',
            light: '#D8FFF9',
            border: '#B3FF9E',
            dark: '#16B19F'
        },
        warning: {
            main: '#EEA12F',
            light: '#FFBB8A',
            background: '#FFF5E3'
        },
        success: {
            main: '#68C26B',
            light: '#81C784',
            background: '#F0FFED'
        },
        error: {
            main: '#FF5F53',
            light: '#E57373'
        },
        other: {
            border: 'rgba(0, 0, 0, 0.23)',
            skipped: '#BDBDBD'
        },
        text: {
            primary: 'rgba(0, 0, 0, 0.87)',
            secondary: 'rgba(0, 0, 0, 0.54)',
            hint: 'rgba(0, 0, 0, 0.38)'
        },
        action: {
            active: 'rgba(0, 0, 0, 0.54)'
        }
    },
    MuiDrawer: {
        width: 240
    },
    mxgraph: {
        border: {
            strong: 4,
            normal: 1
        }
    }
});

theme.overrides = {
    MuiTableRow: {
        root: {
            '&$selected, &$selected:hover': {
                backgroundColor: theme.palette.secondary.light
            }
        }
    },
    MuiTypography: {
        subtitle1: {
            color: theme.palette.text.secondary
        }
    },
    MuiSnackbar: {
        anchorOriginTopCenter: {
            top: '4rem !important'
        }
    },
    MuiFormLabel: {
        root: {
            color: theme.palette.text.hint
        },
        filled: {
            color: theme.palette.text.secondary
        }
    }
};

export default theme;
