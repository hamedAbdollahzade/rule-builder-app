<script setup>
import RuleItem from './RuleItem.vue';

const props = defineProps({
  group: Object,
  isRoot: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update', 'delete']);

// بروزرسانی کل گروه
const updateGroup = (updatedData) => {
  emit('update', { ...props.group, ...updatedData });
};

// اضافه کردن Rule جدید
const addRule = () => {
  const newRules = [...props.group.rules, {
    id: Date.now().toString(), // یک ID ساده برای Key در v-for
    field: 'name',
    operator: '=',
    value: ''
  }];
  updateGroup({ rules: newRules });
};

// اضافه کردن زیرگروه جدید (Recursive step)
const addGroup = () => {
  const newRules = [...props.group.rules, {
    id: Date.now().toString(),
    operator: 'AND',
    rules: [] // گروه جدید با لیست خالی قوانین
  }];
  updateGroup({ rules: newRules });
};

// حذف یک فرزند (چه Rule چه Group)
const removeChild = (childId) => {
  const newRules = props.group.rules.filter(child => child.id !== childId);
  updateGroup({ rules: newRules });
};

// بروزرسانی یک فرزند خاص در لیست
const updateChild = (childId, updatedChild) => {
  const newRules = props.group.rules.map(child =>
      child.id === childId ? updatedChild : child
  );
  updateGroup({ rules: newRules });
};
</script>

<template>
  <div
      class="p-4 mb-4 border-2 rounded-xl transition-all"
      :class="isRoot ? 'border-blue-500 bg-blue-50/30' : 'border-gray-300 bg-gray-50/50 ml-6 sm:ml-10'"
  >
    <!-- هدر گروه: عملیات‌های کنترلی -->
    <div class="flex flex-wrap items-center justify-between gap-4 mb-4">
      <div class="flex items-center gap-2">
        <!-- سوئیچ AND / OR -->
        <div class="inline-flex p-1 bg-gray-200 rounded-lg">
          <button
              v-for="op in ['AND', 'OR']"
              :key="op"
              @click="updateGroup({ operator: op })"
              :class="group.operator === op ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'"
              class="px-3 py-1 text-xs font-bold rounded-md transition-all"
          >
            {{ op }}
          </button>
        </div>
        <span class="text-xs font-medium text-gray-400 uppercase tracking-wider">Condition</span>
      </div>

      <div class="flex items-center gap-2">
        <button @click="addRule" class="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md transition-colors flex items-center gap-1">
          <span class="text-lg leading-none">+</span> Rule
        </button>
        <button @click="addGroup" class="text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-md transition-colors flex items-center gap-1">
          <span class="text-lg leading-none">+</span> Group
        </button>
        <button v-if="!isRoot" @click="emit('delete')" class="text-xs bg-red-100 hover:bg-red-200 text-red-600 px-3 py-1.5 rounded-md transition-colors">
          Delete Group
        </button>
      </div>
    </div>

    <!-- بدنه گروه: لیست فرزندان -->
    <div class="space-y-2">
      <div v-if="group.rules.length === 0" class="text-center py-6 border-2 border-dashed border-gray-200 rounded-lg text-gray-400 text-sm">
        No rules yet. Click "+ Rule" to start.
      </div>

      <template v-for="child in group.rules" :key="child.id">
        <!-- اگر فرزند یک Rule ساده است -->
        <RuleItem
            v-if="child.field !== undefined"
            :rule="child"
            @update="updateChild(child.id, $event)"
            @delete="removeChild(child.id)"
        />

        <!-- اگر فرزند خودش یک گروه است (جادوی بازگشتی اینجا رخ می‌دهد) -->
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
