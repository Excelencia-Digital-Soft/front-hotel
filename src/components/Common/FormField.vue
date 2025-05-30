<!-- src/components/FormField.vue -->
<template>
  <div class="flex items-center mb-4 space-x-4">
    <label :for="id" class="w-32 text-sm font-bold">{{ label }}</label>

    <!-- Select -->
    <select
      v-if="type === 'select'"
      :id="id"
      v-model="model"
      class="flex-1 shadow border rounded py-2 px-3 bg-neutral-700 text-white border-neutral-600 focus:outline-none focus:border-primary-500"
    >
      <option disabled value="">Seleccione una opción</option>
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>

    <!-- Textarea -->
    <textarea
      v-else-if="type === 'textarea'"
      :id="id"
      :placeholder="placeholder"
      v-model="model"
      rows="3"
      class="flex-1 shadow border rounded py-2 px-3 bg-neutral-700 text-white border-neutral-600 focus:outline-none focus:border-primary-500"
    ></textarea>

    <!-- Input (text/number) -->
    <input
      v-else
      :id="id"
      :type="type"
      :placeholder="placeholder"
      v-model="model"
      class="flex-1 shadow border rounded py-2 px-3 bg-neutral-700 text-white border-neutral-600 focus:outline-none focus:border-primary-500"
    />
  </div>
</template>

<script setup>
defineProps({
  id: String,
  label: String,
  type: {
    type: String,
    default: 'text' // 'text', 'number', 'select', 'textarea'
  },
  options: {
    type: Array,
    default: () => []
  },
  modelValue: [String, Number],
  required: {
    type: Boolean,
    default: false
  },
  placeholder: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const model = defineModel()
</script>
