export const FIELD_TYPES = {
    STRING: 'string',
    NUMBER: 'number',
    DATE: 'date'
};

export const FIELDS = [
    {id: 'name', label: 'Name', type: FIELD_TYPES.STRING},
    {id: 'age', label: 'Age', type: FIELD_TYPES.NUMBER},
    {id: 'country', label: 'Country', type: FIELD_TYPES.STRING},
    {id: 'createdAt', label: 'Created At', type: FIELD_TYPES.DATE},
];

export const OPERATORS = {
    [FIELD_TYPES.STRING]: ['=', '!=', 'contains', 'startsWith'],
    [FIELD_TYPES.NUMBER]: ['=', '!=', '>', '<', '>=', '<='],
    [FIELD_TYPES.DATE]: ['=', '>', '<'],
};

export const initialRuleData = {
    id: "root",
    operator: "AND",
    rules: []
};
