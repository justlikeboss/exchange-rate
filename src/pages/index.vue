<script setup>
import { ref, computed, onMounted } from 'vue'

const amount = ref(1000)
const rates = ref({})
const lastUpdate = ref('')
const loading = ref(true)
const error = ref(null)

const POPULAR_CURRENCIES = [
  { code: 'USD', name: 'US Dollar', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
  { code: 'JPY', name: 'Japanese Yen', flag: '🇯🇵' },
  { code: 'KRW', name: 'South Korean Won', flag: '🇰🇷' },
  { code: 'CNY', name: 'Chinese Yuan', flag: '🇨🇳' },
  { code: 'GBP', name: 'British Pound', flag: '🇬🇧' },
  { code: 'AUD', name: 'Australian Dollar', flag: '🇦🇺' },
  { code: 'SGD', name: 'Singapore Dollar', flag: '🇸🇬' },
  { code: 'THB', name: 'Thai Baht', flag: '🇹🇭' },
]

const fetchRates = async () => {
  loading.value = true
  error.value = null
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/TWD')
    const data = await res.json()
    if (data.result === 'success') {
      rates.value = data.rates
      lastUpdate.value = new Date(data.time_last_update_unix * 1000).toLocaleString()
    } else {
      error.value = 'Failed to fetch rates'
    }
  } catch (e) {
    error.value = 'Network error: ' + e.message
  } finally {
    loading.value = false
  }
}

const convertedList = computed(() => {
  return POPULAR_CURRENCIES.map(curr => {
    const rate = rates.value[curr.code] || 0
    // Calculate value: Amount (TWD) * Rate = Target Currency Value
    const val = amount.value * rate
    
    // Format based on currency type (e.g. JPY usually no decimals, but standardizing to 2 is safe)
    return {
      ...curr,
      rate,
      value: val.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })
    }
  })
})

onMounted(fetchRates)
</script>

<template>
  <div class="min-h-screen py-16 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
    <div class="max-w-5xl">
      <div class="text-center space-y-6 mb-16 relative z-10">
        <div class="inline-block p-4 rounded-full bg-white/5 backdrop-blur-3xl mb-4 border border-white/10 ring-1 ring-white/20 shadow-2xl">
          <img class="aspect-square w-12" src="../assets/logo.svg" alt="logo">
        </div>
        <h1 class="text-6xl font-bold tracking-tight text-white drop-shadow-lg">
          Exchange Rate <span class="text-transparent bg-clip-text bg-linear-to-r from-primary to-yellow-200">Pro</span>
        </h1>
        <p class="text-xl text-white/60 max-w-2xl mx-auto font-light">
          Real-time currency conversion tool powered by live market data. 
          <br>Convert <span class="text-primary font-semibold">TWD</span> to the world's top currencies instantly.
        </p>
      </div>

      <div class="glass-card max-w-xl mx-auto mb-16 transform transition-all hover:scale-[1.02] relative group">
        <div class="absolute -inset-1 bg-linear-to-r from-primary to-purple-600 rounded-2xl blur-md opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
        <div class="relative bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
          <label class="block text-sm font-medium text-primary mb-3 uppercase tracking-wider">Amount in New Taiwan Dollar (TWD)</label>
          <div class="relative flex items-center">
            <span class="absolute left-5 text-white/40 text-2xl font-bold pointer-events-none">NT$</span>
            <input 
              v-model.number="amount" 
              type="number" 
              class="w-full bg-white/5 border border-white/10 rounded-xl pl-20 pr-6 py-4 text-4xl font-bold text-white placeholder-white/20 focus:outline-hidden focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-inner"
              placeholder="1000"
            >
          </div>
          <div class="mt-4 flex justify-between text-xs text-white/30">
            <span>Powered by ExchangeRate-API</span>
            <span v-if="lastUpdate">Updated: {{ lastUpdate }}</span>
          </div>
        </div>
      </div>

      <!-- Loading/Error States -->
      <transition name="fade" mode="out-in">
        <div v-if="loading" class="flex flex-col items-center py-20">
          <div class="w-16 h-16 border-4 border-white/10 border-t-primary rounded-full animate-spin mb-4"></div>
          <p class="text-white/50 animate-pulse">Fetching live rates...</p>
        </div>

        <div v-else-if="error" class="text-center py-12 px-6 bg-red-500/10 border border-red-500/20 rounded-2xl max-w-md mx-auto">
          <i class='bx bx-error-circle text-4xl text-red-500 mb-2'></i>
          <p class="text-red-400 font-medium">{{ error }}</p>
          <button @click="fetchRates" class="mt-4 px-6 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors text-sm">
            Try Again
          </button>
        </div>

        <!-- Results Grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="item in convertedList" 
            :key="item.code"
            class="glass-card group cursor-pointer relative overflow-hidden"
          >
            <!-- Decorative gradient blob -->
            <div class="absolute -right-10 -top-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-500"></div>

            <div class="relative z-10 flex flex-col h-full justify-between">
              <div class="flex items-start justify-between mb-6">
                <div class="flex items-center gap-4">
                  <div class="text-5xl shadow-sm filter drop-shadow-md transform group-hover:scale-110 transition-transform duration-300">{{ item.flag }}</div>
                  <div>
                    <h3 class="font-bold text-2xl text-white tracking-tight">{{ item.code }}</h3>
                    <p class="text-xs text-white/50 font-medium uppercase tracking-widest">{{ item.name }}</p>
                  </div>
                </div>
              </div>
              
              <div class="space-y-1">
                <p class="text-sm text-white/40 flex justify-between items-center">
                  <span>Exchange Rate</span>
                  <span class="font-mono text-primary bg-primary/10 px-2 py-0.5 rounded-sm">{{ item.rate.toFixed(5) }}</span>
                </p>
                <div class="pt-4 border-t border-white/10 mt-4">
                  <p class="text-4xl font-bold text-white tracking-tight tabular-nums group-hover:text-primary transition-colors duration-300 line-clamp-1">
                    {{ item.value }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Hide spin button for number input */
input[type=number]::-webkit-inner-spin-button, 
input[type=number]::-webkit-outer-spin-button { 
  -webkit-appearance: none; 
  margin: 0; 
}
</style>