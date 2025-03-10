# Avro Schema Component

The component is used for making an Scripts schema.

## Usage

```javascript
// Specify a schema for fields in a needed format.
const schemaFields = [
    {
        source: sources.Workspace,
        filePath: ''
    },
    {
        source: sources.Volumes,
        filePath: '/Volumes/path'
    },
    {
        source: sources.S3,
        filePath: 's3://path',
        region: 'auto'
    }
];

const ScriptsWrapper = () => {
    // Callback for getting changed fields from the scripts component
    const onChange = ({ isValid, fields }) => console.log({ isValid, fields });

    return <ScriptsSchema onChange={onChange} schemaFields={schemaFields} />;
};

export default Scripts;
```

## Field schema definition

A definition for a field schema:

```json
{
    "source": "string",
    "filePath": "string",
    "region": "string"
}
```

Supported types (can be found [here](./sources.js)):

```javascript
const sources = {
    Workspace: 'workspace',
    Volumes: 'volumes',
    S3: 's3'
};
```
