export const FIELD_TYPES = {
    STRING: 'string',
    NUMBER: 'number',
    DATE: 'date',
    SELECT: 'select',
    CURRENCY: 'currency'
}

export const OPERATORS = {
    string: ['=', '!=', 'contains'],

    number: ['=', '!=', '>', '<', '>=', '<='],

    date: ['=', '!=', '>', '<'],

    currency: ['=', '!=', '>', '<', '>=', '<='],

    select: ['=', '!=']
}

export const FIELDS = [
    {
        id: 'name',
        label: 'Name',
        type: FIELD_TYPES.STRING
    },

    {
        id: 'country',
        label: 'Country',
        type: FIELD_TYPES.SELECT,
        options: ['Iran', 'Germany', 'Canada']
    },

    {
        id: 'age',
        label: 'Age',
        type: FIELD_TYPES.CURRENCY
    },

    {
        id: 'createdAt',
        label: 'Created At',
        type: FIELD_TYPES.DATE
    }
]

export const initialRuleData = {
    id: "root",
    operator: "AND",
    rules: []
}
