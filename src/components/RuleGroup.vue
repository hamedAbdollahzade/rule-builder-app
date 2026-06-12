<script setup>
import RuleItem from './RuleItem.vue'

const props = defineProps({
  group: Object,
  isRoot: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update', 'delete'])

const updateGroup = (updatedData) => {
  emit('update', { ...props.group, ...updatedData })
}

const addRule = () => {
  const newRules = [
    ...props.group.rules,
    {
      id: Date.now().toString(),
      field: 'name',
      operator: '=',
      value: '',
      logic: 'AND',
      not: false
    }
  ]

  updateGroup({ rules: newRules })
}

const addGroup = () => {
  const newRules = [
    ...props.group.rules,
    {
      id: Date.now().toString(),
      operator: 'AND',
      rules: []
    }
  ]

  updateGroup({ rules: newRules })
}

const removeChild = (childId) => {
  const newRules = props.group.rules.filter(
      (child) => child.id !== childId
  )

  updateGroup({ rules: newRules })
}

const updateChild = (childId, updatedChild) => {
  const newRules = props.group.rules.map((child) =>
      child.id === childId ? updatedChild : child
  )

  updateGroup({ rules: newRules })
}
</script>

<template>
  <div
      class="p-4 mb-4 border-2 rounded-xl transition-all"
      :class="isRoot
      ? 'border-blue-500 bg-blue-50/30'
      : 'border-gray-300 bg-gray-50/50 ml-6 sm:ml-10'"
  >

    <!-- Header -->
    <div class="flex flex-wrap items-center justify-between gap-4 mb-4">

      <span class="text-xs font-medium text-gray-400 uppercase tracking-wider">
        Condition Group
      </span>

      <div class="flex items-center gap-2">

        <button
            @click="addRule"
            class="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md transition-colors flex items-center gap-1"
        >
          + Rule
        </button>

        <button
            @click="addGroup"
            class="text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-md transition-colors flex items-center gap-1"
        >
          + Group
        </button>

        <button
            v-if="!isRoot"
            @click="emit('delete')"
            class="text-xs bg-red-100 hover:bg-red-200 text-red-600 px-3 py-1.5 rounded-md transition-colors"
        >
          Delete Group
        </button>

      </div>
    </div>

    <!-- Rules -->
    <div class="space-y-2">

      <div
          v-if="group.rules.length === 0"
          class="text-center py-6 border-2 border-dashed border-gray-200 rounded-lg text-gray-400 text-sm"
      >
        No rules yet. Click "+ Rule" to start.
      </div>

      <template v-for="(child, index) in group.rules" :key="child.id">

        <RuleItem
            v-if="child.field !== undefined"
            :rule="child"
            :index="index"
            @update="updateChild(child.id, $event)"
            @delete="removeChild(child.id)"
        />

        <RuleGroup
            v-else
            :group="child"
            @update="updateChild(child.id, $event)"
            @delete="removeChild(child.id)"
        />

      </template>

    </div>
  </div>
</template>
