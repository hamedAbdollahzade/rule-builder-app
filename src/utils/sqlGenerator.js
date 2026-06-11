export const convertToSQL = (group) => {
    // اگر گروه خالی بود
    if (!group.rules || group.rules.length === 0) return '';

    // تبدیل تک‌تک آیتم‌ها (Rule یا Group)
    const parts = group.rules.map(child => {
        // اگر این یک Rule است (فیلد دارد)
        if (child.field !== undefined) {
            const val = typeof child.value === 'string' ? `'${child.value}'` : child.value;
            return `${child.field} ${child.operator} ${val}`;
        }
        // اگر این یک زیرگروه است (بازگشتی عمل کن)
        else {
            return `(${convertToSQL(child)})`;
        }
    });

    // چسباندن بخش‌ها با AND یا OR
    return parts.join(` ${group.operator} `);
};
