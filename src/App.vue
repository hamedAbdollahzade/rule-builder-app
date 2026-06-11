<script setup>
import {computed, ref, watch} from 'vue';
import RuleGroup from './components/RuleGroup.vue';
import {initialRuleData} from './data/constants';
import { convertToSQL } from './utils/sqlGenerator';

const queryData = ref({...initialRuleData});

// برای نمایش در بخش Preview (تمیز کردن IDهای موقت در صورت نیاز)
// اینجا فقط یک کپی برای نمایش داریم
const jsonOutput = ref('');

watch(queryData, (newVal) => {
  // تبدیل به فرمت JSON برای نمایش در لحظه
  jsonOutput.value = JSON.stringify(newVal, null, 2);
}, {deep: true, immediate: true});

const resetQuery = () => {
  if (confirm('Are you sure you want to clear everything?')) {
    queryData.value = {
      id: "root",
      operator: "AND",
      rules: []
    };
  }
};

const sqlOutput = computed(() => {
  const sql = convertToSQL(queryData.value);
  return sql ? `(${sql})` : 'No rules defined yet.';
});

</script>

<template>
  <div class="min-h-screen bg-gray-100 p-4 sm:p-8 font-sans text-gray-900">
    <div class="max-w-5xl mx-auto">

      <!-- Header -->
      <header class="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <div>
          <h1 class="text-2xl font-bold text-blue-600">Rule Builder <span
              class="text-gray-400 text-sm font-normal">v1.0</span></h1>
          <p class="text-gray-500 text-sm italic">"Building logic, one rule at a time..." - Hamed 🚀</p>
        </div>
        <button
            @click="resetQuery"
            class="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-100"
        >
          Reset All
        </button>
      </header>

      <main class="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <!-- لایه سمت چپ: ویرایشگر اصلی -->
        <section class="lg:col-span-2">
          <div class="bg-white p-2 rounded-2xl shadow-sm border border-gray-200 min-h-100">
            <!-- ریشه اصلی گروه ها -->
            <RuleGroup
                :group="queryData"
                :isRoot="true"
                @update="queryData = $event"
            />
          </div>
        </section>


        <section class="lg:col-span-1">
          <div class="sticky top-8">
            <div class="bg-gray-900 rounded-2xl shadow-xl overflow-hidden border border-gray-800">
              <div class="flex items-center justify-between px-4 py-3 bg-gray-800 border-b border-gray-700">
                <span class="text-xs font-mono text-gray-400 uppercase tracking-widest">Output JSON</span>
                <div class="flex gap-1.5">
                  <div class="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                  <div class="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                  <div class="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                </div>
              </div>
              <pre class="p-4 text-sm text-green-400 font-mono overflow-auto max-h-[500px] custom-scrollbar">{{
                  jsonOutput
                }}</pre>
            </div>

            <div class="mt-6 p-4 bg-slate-800 text-green-400 rounded-lg font-mono text-sm">
              <h3 class="text-white mb-2 border-b border-slate-700 pb-1">SQL Output:</h3>
              <code>SELECT * FROM table WHERE {{ sqlOutput }}</code>
            </div>

            <div class="mt-4 p-4 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-200">
              <h3 class="font-bold text-sm mb-1">Pro Tip! 💡</h3>
              <p class="text-xs text-blue-100 leading-relaxed">
                این سیستم کاملاً Recursive هست. می‌تونی تا بی‌نهایت گروه تو در تو بسازی و خروجی JSON رو به صورت
                Real-time مانیتور کنی.
              </p>
            </div>




          </div>
        </section>

      </main>
    </div>
  </div>
</template>

<style>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #111827;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #374151;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #4b5563;
}

.v-enter-active, .v-leave-active {
  transition: opacity 0.3s ease;
}

.v-enter-from, .v-leave-to {
  opacity: 0;
}
</style>
