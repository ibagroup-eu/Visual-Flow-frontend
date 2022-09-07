# Avro Schema Component

The component is used for making an Avro schema.

## Usage

```javascript
// Specify a schema for fields in a needed format.
const schemaFields = [
    {
        name: 'Field_1',
        type: types.Boolean,
        nullable: true
    },
    {
        name: 'Field_2',
        type: types.String,
        nullable: false
    }
];

const AvroWrapper = () => {
    // Callback for getting changed fields from the avro component
    const onChange = ({ isValid, fields }) => console.log({ isValid, fields });

    return <AvroSchema onChange={onChange} schemaFields={schemaFields} />;
};

export default Avro;
```

## Field schema definition

A definition for a field schema:

```json
{
    "name": "string",
    "type": "string",
    "nullable": "bool"
}
```

Supported types (can be found [here](./types.js)):

```javascript
const types = {
    Boolean: 'boolean',
    Double: 'double',
    Integer: 'int',
    Float: 'float',
    String: 'string'
};
```
