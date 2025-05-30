// src/composables/useMessage.js
import { ref } from 'vue';

export function useMessage() {
  const message = ref({ text: '', type: '' });

  const showMessage = (text, type = 'success', duration = 3000) => {
    message.value = { text, type };
    if (duration > 0) {
      setTimeout(() => {
        message.value = { text: '', type: '' };
      }, duration);
    }
  };

  const clearMessage = () => {
    message.value = { text: '', type: '' };
  };

  return {
    message,
    showMessage,
    clearMessage,
  };
}