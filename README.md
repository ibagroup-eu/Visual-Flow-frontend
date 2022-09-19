# About Visual Flow

Visual Flow is an ETL tool designed for effective data manipulation via convenient and user-friendly interface. The tool has the following capabilities:

- Can integrate data from heterogeneous sources:
  - DB2
  - IBM COS
  - AWS S3
  - Elastic Search
  - PostgreSQL
  - MySQL/Maria
  - MSSQL
  - Oracle
  - Cassandra
  - Mongo
  - Redis
  - Redshift
- Leverage direct connectivity to enterprise applications as sources and targets
- Perform data processing and transformation
- Run custom code
- Leverage metadata for analysis and maintenance

Visual Flow application is divided into the following repositories:

- _**Visual-Flow-frontend**_ (current)
- [Visual-Flow-backend](https://github.com/ibagomel/Visual-Flow-backend)
- [Visual-Flow-jobs](https://github.com/ibagomel/Visual-Flow-jobs)
- [Visual-Flow-deploy](https://github.com/ibagomel/Visual-Flow-deploy)

## Visual Flow Frontend

##### Process Overview

Visual Flow jobs and pipelines exist within a certain namespace (project) so the first step in the application would be to create a project or enter existing project. Then you need to enter Job Designer to create a job.

##### JobDesigner

Job designer is a graphical design interface used to create, maintain,execute and analyze jobs. Each job determines the data sources, the required transformations and destination of the data.
Designing a pipeline is similar to designing a job.

##### PipelineDesigner

Pipeline designer is a graphical design interface aimed for managing pipelines.

Visual Flow key functions include but not limited to 

- Create project which serves as a namespace for jobs and/or pipelines
- Manage project settings
- User access management
- Create/maintain a job in Job Designer
- Job execution and logs analysis
- Create/maintain a pipeline in Pipeline Designer
- Pipeline execution
- Import/Export jobs and pipelines

##### Roles and authorizations

The following roles are available in the application:

- Viewer
- Operator
- Editor
- Administrator

They can perform the below operations within the namespaces they are authorized to.
Only Super-admin user can create a workspace (project) and grant access to this project.

## Development

[Check the official guide](./DEVELOPMENT.md).

## Contribution

[Check the official guide](https://github.com/ibagomel/Visual-Flow/blob/main/CONTRIBUTING.md).

## License

Visual Flow is an open-source software licensed under the [Apache-2.0 license](./LICENSE).
