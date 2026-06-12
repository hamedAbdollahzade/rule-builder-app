<script setup>
import {computed} from 'vue'
import {FIELDS, FIELD_TYPES, OPERATORS} from '../data/constants.js'

const props = defineProps({
  rule: Object,
  index: Number
})

const emit = defineEmits(['update', 'delete'])

const updateValue = (key, value) => {
  emit('update', {
    ...props.rule,
    [key]: value
  })
}

const selectedField = computed(() =>
    FIELDS.find((f) => f.id === props.rule.field) || {}
)

const availableOperators = computed(() => {
  if (!selectedField.value.type) return []

  return OPERATORS[selectedField.value.type] || []
})

const onFieldChange = (event) => {
  const fieldId = event.target.value
  const field = FIELDS.find((f) => f.id === fieldId)

  emit('update', {
    ...props.rule,
    field: fieldId,
    operator: OPERATORS[field.type][0],
    value: ''
  })
}
</script>

<template>
  <div
      class="flex flex-wrap items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg shadow-sm"
  >

    <!-- AND / OR -->
    <div
        v-if="index !== 0"
        class="inline-flex p-1 bg-gray-100 rounded-lg"
    >
      <button
          v-for="op in ['AND','OR']"
          :key="op"
          @click="updateValue('logic', op)"
          :class="rule.logic === op
          ? 'bg-white shadow text-blue-600'
          : 'text-gray-500'"
          class="px-2 py-1 text-xs font-bold rounded transition-all"
      >
        {{ op }}
      </button>
    </div>

    <!-- NOT -->
    <button
        @click="updateValue('not', !rule.not)"
        :class="rule.not
        ? 'bg-red-500 text-white'
        : 'bg-gray-200 text-gray-600'"
        class="px-2 py-1 text-xs font-bold rounded transition-all"
    >
      NOT
    </button>

    <!-- Field -->
    <select
        :value="rule.field"
        @change="onFieldChange"
        class="p-2 border rounded-md bg-gray-50 text-sm"
    >
      <option value="" disabled>Select Field</option>

      <option
          v-for="f in FIELDS"
          :key="f.id"
          :value="f.id"
      >
        {{ f.label }}
      </option>

    </select>

    <!-- Operator -->
    <select
        v-if="rule.field"
        :value="rule.operator"
        @change="updateValue('operator',$event.target.value)"
        class="p-2 border rounded-md bg-gray-50 text-sm"
    >

      <option
          v-for="op in availableOperators"
          :key="op"
          :value="op"
      >
        {{ op }}
      </option>

    </select>

    <!-- Value -->
    <div v-if="rule.field" class="flex-1 min-w-[150px]">

      <!-- NUMBER -->
      <input
          v-if="selectedField.type === FIELD_TYPES.NUMBER"
          type="number"
          step="1"
          :value="rule.value"
          @input="updateValue('value', Math.floor(Number($event.target.value)))"
          class="w-full p-2 border rounded-md text-sm"
      />


      <!-- DATE -->
      <input
          v-else-if="selectedField.type === FIELD_TYPES.DATE"
          type="date"
          :value="rule.value"
          @input="updateValue('value', $event.target.value)"
          class="w-full p-2 border rounded-md text-sm"
      />

      <!-- CURRENCY -->
      <input
          v-else-if="selectedField.type === FIELD_TYPES.CURRENCY"
          type="number"
          step="0.01"
          placeholder="$ amount"
          :value="rule.value"
          @input="updateValue('value', Number($event.target.value))"
          class="w-full p-2 border rounded-md text-sm"
      />

      <!-- SELECT -->
      <select
          v-else-if="selectedField.type === FIELD_TYPES.SELECT"
          :value="rule.value"
          @change="updateValue('value', $event.target.value)"
          class="w-full p-2 border rounded-md text-sm bg-gray-50"
      >
        <option value="">Select...</option>

        <option
            v-for="opt in selectedField.options"
            :key="opt"
            :value="opt"
        >
          {{ opt }}
        </option>

      </select>

      <!-- STRING -->
      <input
          v-else
          type="text"
          :value="rule.value"
          @input="updateValue('value', $event.target.value)"
          placeholder="Value..."
          class="w-full p-2 border rounded-md text-sm"
      />

    </div>


    <!-- Delete -->
    <button
        @click="emit('delete')"
        class="p-2 text-red-500 hover:bg-red-50 rounded-full"
    >
      ✕
    </button>

  </div>
</template>
