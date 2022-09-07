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

const express = require('express');
const session = require('express-session');
const passport = require('passport');
const passportSetup = require('./passport-setup');
const normalizeUrl = require('../utils/normalizeUrl');
const config = require('../config');

const router = new express.Router();

// TODO: Setup certificates!
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

// set up session
router.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 3600 * 1000
        }
    })
);
router.use(passport.initialize());
router.use(passport.session());

const handleLogin = (req, res, next) => {
    if (req.query.redirect) {
        req.session.redirectUrl = normalizeUrl(req.query.redirect);
    }
    passport.authenticate(passportSetup.strategy.name, {
        forceLogin: true
    })(req, res, next);
};

router.get('/login', handleLogin);

const callback = (req, res) => {
    res.redirect(
        req.session.redirectUrl
            ? config.app.baseUrl + req.session.redirectUrl
            : config.app.baseUrl
    );
    delete req.session.redirectUrl;
};

router.get(
    '/callback',
    passport.authenticate(passportSetup.strategy.name, {
        failureRedirect: '/login'
    }),
    callback
);

const isLoggedIn = (req, res, next) => {
    if (req.user) {
        return next();
    }
    return res.sendStatus(401);
};

router.get('/profile', isLoggedIn, (req, res) => {
    res.json(req.user.profile);
});

module.exports = { router, handleLogin, callback };
