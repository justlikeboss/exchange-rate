<script setup>
import { ref, onMounted, watch } from 'vue'

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

const selectedCurrency = ref('USD')
const historyData = ref([])
const loading = ref(false)
const error = ref(null)

// Date range: Last 30 days
const endDate = new Date().toISOString().split('T')[0]
const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

const fetchHistory = async () => {
  loading.value = true
  error.value = null
  try {
    const url = `https://api.finmindtrade.com/api/v4/data?dataset=TaiwanExchangeRate&data_id=${selectedCurrency.value}&start_date=${startDate}&end_date=${endDate}`
    const res = await fetch(url)
    const data = await res.json()
    
    if (data.msg === 'success') {
      // Sort by date descending (newest first)
      historyData.value = data.data.reverse()
    } else {
      error.value = 'Failed to fetch historical data'
    }
  } catch (e) {
    error.value = 'Network error: ' + e.message
  } finally {
    loading.value = false
  }
}

watch(selectedCurrency, fetchHistory)
onMounted(fetchHistory)
</script>

<template>
  <div class="min-h-screen py-20 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
    <div class="max-w-6xl w-full">
      <div class="glass-card bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
        <div class="flex flex-col md:flex-row justify-between items-center mb-8 border-b border-white/10 pb-6 gap-6">
          <h2 class="text-3xl font-bold text-white">Historical Exchange Rates</h2>
          
          <div class="flex items-center gap-4">
            <span class="text-white/60 text-sm">Select Currency:</span>
            <div class="relative">
              <select 
                v-model="selectedCurrency"
                class="appearance-none bg-white/5 border border-white/20 hover:border-primary/50 rounded-lg py-2 pl-4 pr-10 text-white focus:outline-hidden focus:ring-2 focus:ring-primary/50 transition-colors cursor-pointer"
              >
                <option v-for="curr in POPULAR_CURRENCIES" :key="curr.code" :value="curr.code" class="bg-slate-800 text-white">
                  {{ curr.flag }} {{ curr.code }} - {{ curr.name }}
                </option>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-white/50">
                <i class='bx bx-chevron-down text-xl'></i>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Loading State -->
        <div v-if="loading" class="py-20 flex flex-col items-center">
          <div class="w-12 h-12 border-4 border-white/10 border-t-primary rounded-full animate-spin mb-4"></div>
          <p class="text-white/50 animate-pulse">Loading historical data...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-12 px-6 bg-red-500/10 border border-red-500/20 rounded-2xl max-w-md mx-auto my-8">
          <i class='bx bx-error-circle text-4xl text-red-500 mb-2'></i>
          <p class="text-red-400 font-medium">{{ error }}</p>
          <button @click="fetchHistory" class="mt-4 px-6 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors text-sm">
            Try Again
          </button>
        </div>

        <!-- Data Table -->
        <div v-else class="overflow-x-auto">
          <table class="w-full text-left text-white/80">
            <thead>
              <tr class="border-b border-white/10 text-white/50 text-sm uppercase tracking-wider">
                <th class="py-4 px-4">Date</th>
                <th class="py-4 px-4 text-right">Cash Buy</th>
                <th class="py-4 px-4 text-right">Cash Sell</th>
                <th class="py-4 px-4 text-right">Spot Buy</th>
                <th class="py-4 px-4 text-right">Spot Sell</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5">
              <tr v-for="(item, index) in historyData" :key="index" class="hover:bg-white/5 transition-colors group">
                <td class="py-4 px-4 font-mono text-primary font-medium">{{ item.date }}</td>
                <td class="py-4 px-4 text-right font-mono group-hover:text-white transition-colors">{{ item.cash_buy }}</td>
                <td class="py-4 px-4 text-right font-mono group-hover:text-white transition-colors">{{ item.cash_sell }}</td>
                <td class="py-4 px-4 text-right font-mono group-hover:text-white transition-colors">{{ item.spot_buy }}</td>
                <td class="py-4 px-4 text-right font-mono group-hover:text-white transition-colors">{{ item.spot_sell }}</td>
              </tr>
              <tr v-if="historyData.length === 0" class="text-center">
                <td colspan="5" class="py-12 text-white/40">No data available for this period.</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div class="mt-6 text-right text-xs text-white/30">
          Data provided by FinMind API
        </div>
      </div>
    </div>
  </div>
</template>

<route lang="json">
{
  "name": "history",
  "meta": {
    "name": "History"
  }
}
</route>