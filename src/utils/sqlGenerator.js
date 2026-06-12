export const convertToSQL = (group) => {
    if (!group.rules || group.rules.length === 0) return '';

    const parts = group.rules.map((child, index) => {

        let condition = '';

        if (child.field !== undefined) {
            const val =
                typeof child.value === 'string'
                    ? `'${child.value}'`
                    : child.value;

            condition = `${child.field} ${child.operator} ${val}`;

            // ✅ اعمال NOT
            if (child.not) {
                condition = `NOT (${condition})`;
            }

        } else {
            condition = `(${convertToSQL(child)})`;
        }

        if (index === 0) return condition;

        return `${child.logic || 'AND'} ${condition}`;
    });

    return parts.join(' ');
};
