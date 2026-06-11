<script setup>
import { computed } from 'vue';
import { FIELDS, OPERATORS, FIELD_TYPES } from '../data/constants';

const props = defineProps({
  rule: Object
});

const emit = defineEmits(['update', 'delete']);

// پیدا کردن مشخصات فیلد انتخاب شده
const selectedField = computed(() =>
    FIELDS.find(f => f.id === props.rule.field)
);

// لیست اپراتورهای مجاز بر اساس نوع فیلد
const availableOperators = computed(() => {
  if (!selectedField.value) return [];
  return OPERATORS[selectedField.value.type];
});

// هندل کردن تغییر فیلد (ریست کردن اپراتور و مقدار در صورت تغییر فیلد)
const onFieldChange = (e) => {
  const fieldId = e.target.value;
  const field = FIELDS.find(f => f.id === fieldId);

  emit('update', {
    ...props.rule,
    field: fieldId,
    operator: OPERATORS[field.type][0], // اولین اپراتور پیشفرض
    value: field.type === FIELD_TYPES.NUMBER ? 0 : '' // مقدار اولیه پیشفرض
  });
};

const updateValue = (key, val) => {
  emit('update', { ...props.rule, [key]: val });
};
</script>

<template>
  <div class="flex flex-wrap items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg shadow-sm mb-2">
    <!-- انتخاب فیلد -->
    <select
        :value="rule.field"
        @change="onFieldChange"
        class="p-2 border rounded-md bg-gray-50 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
    >
      <option value="" disabled>Select Field</option>
      <option v-for="f in FIELDS" :key="f.id" :value="f.id">{{ f.label }}</option>
    </select>

    <!-- انتخاب اپراتور (داینامیک) -->
    <select
        v-if="rule.field"
        :value="rule.operator"
        @change="updateValue('operator', $event.target.value)"
        class="p-2 border rounded-md bg-gray-50 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
    >
      <option v-for="op in availableOperators" :key="op" :value="op">{{ op }}</option>
    </select>

    <!-- ورودی مقدار (داینامیک بر اساس نوع فیلد) -->
    <div v-if="rule.field" class="flex-1 min-w-[150px]">
      <!-- اگر عدد بود -->
      <input
          v-if="selectedField.type === FIELD_TYPES.NUMBER"
          type="number"
          :value="rule.value"
          @input="updateValue('value', Number($event.target.value))"
          class="w-full p-2 border rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500"
      />
      <!-- اگر تاریخ بود -->
      <input
          v-else-if="selectedField.type === FIELD_TYPES.DATE"
          type="date"
          :value="rule.value"
          @input="updateValue('value', $event.target.value)"
          class="w-full p-2 border rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500"
      />
      <!-- در غیر این صورت (متن) -->
      <input
          v-else
          type="text"
          :value="rule.value"
          @input="updateValue('value', $event.target.value)"
          placeholder="Value..."
          class="w-full p-2 border rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <!-- دکمه حذف Rule -->
    <button
        @click="emit('delete')"
        class="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
        title="Delete Rule"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    </button>
  </div>
</template>
