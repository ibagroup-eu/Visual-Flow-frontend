# About Visual Flow

Visual Flow is an ETL/ELT tool designed for effective data management via convenient and user-friendly interface. The tool has the following capabilities:

- Can integrate data from heterogeneous sources:
  - Azure Blob Storage
  - AWS S3
  - Cassandra
  - Click House
  - DB2
  - Databricks JDBC (global configuration)
  - Databricks (Databricks configuration)
  - Dataframe (for reading)
  - Google Cloud Storage
  - Elastic Search
  - IBM COS
  - Kafka
  - Local File
  - MS SQL
  - Mongo
  - MySQL/Maria
  - Oracle
  - PostgreSQL
  - Redis
  - Redshift
  - REST API
- It supports the following file formats:
  - Delta Lake
  - Parquet
  - JSON
  - CSV
  - ORC
  - Avro
  - Text
  - Binary (PDF, DOC, Audio files)
- Leverage direct connectivity to enterprise applications as sources and targets
- Perform data processing and transformation
- Run custom code
- Leverage metadata for analysis and maintenance
- Allows to deploy in two configurations and run jobs in Spark/Kubernetes and Databricks environments respectively
- Leverages Generative AI capabilities via tasks like Parse text, Generate data, Transcribe, Generic task

Visual Flow application is divided into the following repositories:

- _**Visual-Flow-frontend**_ (current)
- [Visual-Flow-backend](https://github.com/ibagroup-eu/Visual-Flow-backend)
- [Visual-Flow-jobs](https://github.com/ibagroup-eu/Visual-Flow-jobs)
- [Visual-Flow-deploy](https://github.com/ibagroup-eu/Visual-Flow-deploy)
- [Visual-Flow-backend-db-service](https://github.com/ibagroup-eu/Visual-Flow-backend-db-service)
- [Visual-Flow-backend-history-service](https://github.com/ibagroup-eu/Visual-Flow-backend-history-service)

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

[Check the official guide](https://github.com/ibagroup-eu/Visual-Flow/blob/main/CONTRIBUTING.md).

## License

Visual Flow is an open-source software licensed under the [Apache-2.0 license](./LICENSE).

