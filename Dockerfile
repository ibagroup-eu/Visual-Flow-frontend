#
# Copyright (c) 2021 IBA Group, a.s. All rights reserved.
#
# Licensed to the Apache Software Foundation (ASF) under one or more
# contributor license agreements.  See the NOTICE file distributed with
# this work for additional information regarding copyright ownership.
# The ASF licenses this file to You under the Apache License, Version 2.0
# (the "License"); you may not use this file except in compliance with
# the License.  You may obtain a copy of the License at
#
#   http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

FROM public.ecr.aws/lambda/nodejs:16.2022.06.07.18
ARG PORT=8888
WORKDIR /app/backend
ENV EXPRESS_PORT=$PORT

COPY ./json-server /app/json-server
COPY ./backend /app/backend
COPY ./frontend /app/frontend

# Description & app version
COPY ./package.json /app/package.json

RUN yum update -y && chmod -R 777 /app/
ENTRYPOINT ["sh","-c","(cd /app/json-server && npm run start) & npm run start:prod"]
EXPOSE $PORT
