# Avro Schema Component

The component is used for making an Cluster Tags schema.

## Usage

```javascript
// Specify a schema for fields in a needed format.
const schemaFields = [
    {
        clusterKey: 'Field_1',
        value: 'value_1'
    },
    {
        clusterKey: 'Field_2',
        value: 'value_2'
    }
];

const TagsWrapper = () => {
    // Callback for getting changed fields from the tags component
    const onChange = ({ isValid, fields }) => console.log({ isValid, fields });

    return <TagsSchema onChange={onChange} schemaFields={schemaFields} />;
};

export default Tags;
```

## Field schema definition

A definition for a field schema:

```json
{
    "clusterKey": "string",
    "value": "string"
}
```
