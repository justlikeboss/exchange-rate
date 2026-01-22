<script setup>
import { ref, onMounted, computed, watch } from 'vue'

const loading = ref(true)
const error = ref(null)
const rawData = ref([])
const exchangeRate = ref(0)
const hoveredPoint = ref(null)
const chartContainer = ref(null)

const fetchExchangeRate = async () => {
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD')
    const data = await res.json()
    if (data.result === 'success') {
      exchangeRate.value = data.rates.TWD
    }
  } catch (e) {
    console.error('Failed to fetch exchange rate', e)
  }
}

// Convert raw data to TWD
const convertedData = computed(() => {
  if (!rawData.value.length || !exchangeRate.value) return []
  return rawData.value.map(point => ({
    ...point,
    Price: point.Price * exchangeRate.value
  }))
})

// Computed stats
const currentPrice = computed(() => {
  if (!convertedData.value.length) return 0
  return convertedData.value[convertedData.value.length - 1].Price
})

const previousPrice = computed(() => {
  if (convertedData.value.length < 2) return 0
  return convertedData.value[convertedData.value.length - 2].Price
})

const priceChange = computed(() => currentPrice.value - previousPrice.value)
const priceChangePercent = computed(() => {
  if (!previousPrice.value) return 0
  return (priceChange.value / previousPrice.value) * 100
})

const maxPrice = computed(() => {
  if (!convertedData.value.length) return 0
  return Math.max(...convertedData.value.map(d => d.Price))
})

const minPrice = computed(() => {
  if (!convertedData.value.length) return 0
  return Math.min(...convertedData.value.map(d => d.Price))
})

const chartData = computed(() => {
  if (!convertedData.value.length) return []
  // Downsample if too many points (target ~100 points for the chart)
  const targetPoints = 100
  const step = Math.ceil(convertedData.value.length / targetPoints)
  
  return convertedData.value.filter((_, index) => index % step === 0).map(point => ({
    ...point,
    timestamp: new Date(point.date).getTime()
  }))
})

// Chart dimensions
const width = 800
const height = 300
const padding = 20

const points = computed(() => {
  if (!chartData.value.length) return ''
  
  const min = Math.min(...chartData.value.map(d => d.Price))
  const max = Math.max(...chartData.value.map(d => d.Price))
  const range = max - min
  
  // X: Time
  const startTime = chartData.value[0].timestamp
  const endTime = chartData.value[chartData.value.length - 1].timestamp
  const timeRange = endTime - startTime
  
  return chartData.value.map((point, index) => {
    const x = ((point.timestamp - startTime) / timeRange) * (width - padding * 2) + padding
    const y = height - (((point.Price - min) / range) * (height - padding * 2) + padding)
    return `${x},${y}`
  }).join(' ')
})


const fetchData = async () => {
  loading.value = true
  try {
    // Fetch both data sources in parallel
    const [goldRes, _] = await Promise.all([
      fetch('https://api.finmindtrade.com/api/v4/data?dataset=GoldPrice&end_date=2026-01-22&start_date=2025-12-23'),
      fetchExchangeRate()
    ])
    
    const json = await goldRes.json()
    if (json.msg === 'success' && json.data) {
      rawData.value = json.data
    } else {
      error.value = 'Failed to load data'
    }
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

// Interactive chart utils
const handleMouseMove = (e) => {
  if (!chartContainer.value || !chartData.value.length) return
  
  const rect = chartContainer.value.getBoundingClientRect()
  const x = e.clientX - rect.left
  const widthRatio = (x - padding) / (width - padding * 2)
  
  // Find closest point in downsampled data
  const index = Math.round(widthRatio * (chartData.value.length - 1))
  const clampedIndex = Math.max(0, Math.min(index, chartData.value.length - 1))
  
  hoveredPoint.value = chartData.value[clampedIndex]
}

const handleMouseLeave = () => {
  hoveredPoint.value = null
}

const getX = (point) => {
  if (!chartData.value.length) return 0
  const startTime = chartData.value[0].timestamp
  const endTime = chartData.value[chartData.value.length - 1].timestamp
  const timeRange = endTime - startTime
  return ((point.timestamp - startTime) / timeRange) * (width - padding * 2) + padding
}

const getY = (point) => {
  if (!chartData.value.length) return 0
  const min = Math.min(...chartData.value.map(d => d.Price))
  const max = Math.max(...chartData.value.map(d => d.Price))
  const range = max - min
  return height - (((point.Price - min) / range) * (height - padding * 2) + padding)
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <div class="min-h-screen py-10 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
    <div class="max-w-6xl w-full space-y-8">
      
      <!-- Header -->
      <div class="text-center space-y-4">
        <h1 class="text-5xl font-bold text-white tracking-tight">
          Gold Price <span class="text-yellow-400">Analytics</span>
        </h1>
        <p class="text-white/60">Tracking Gold Price (TWD/oz)</p>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Current Price -->
        <div class="glass-card flex flex-col items-center justify-center py-8 relative overflow-hidden group">
          <div class="absolute inset-0 bg-linear-to-b from-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div class="z-10 text-center">
            <h3 class="text-white/50 text-sm font-medium uppercase tracking-wider mb-2">Current Price</h3>
            <div class="text-4xl font-bold text-white mb-2">
              <span class="text-yellow-400 text-2xl mr-1">NT$</span>
              {{ currentPrice.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }}
            </div>
            <div :class="['flex items-center gap-1 text-sm font-semibold', priceChange >= 0 ? 'text-green-400' : 'text-red-400']">
              <i class='bx' :class="priceChange >= 0 ? 'bx-trending-up' : 'bx-trending-down'"></i>
              <span>{{ priceChange >= 0 ? '+' : '' }}{{ priceChange.toLocaleString(undefined, { maximumFractionDigits: 0 }) }} ({{ priceChangePercent.toFixed(2) }}%)</span>
            </div>
          </div>
        </div>

        <!-- High -->
        <div class="glass-card flex flex-col items-center justify-center py-8 relative group">
          <div class="absolute inset-0 bg-linear-to-b from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <h3 class="text-white/50 text-sm font-medium uppercase tracking-wider mb-2">Period High</h3>
          <div class="text-3xl font-bold text-white">
             <span class="text-yellow-400 text-xl mr-1">NT$</span>{{ maxPrice?.toLocaleString(undefined, { maximumFractionDigits: 0 }) }}
          </div>
        </div>

        <!-- Low -->
        <div class="glass-card flex flex-col items-center justify-center py-8 relative group">
          <div class="absolute inset-0 bg-linear-to-b from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <h3 class="text-white/50 text-sm font-medium uppercase tracking-wider mb-2">Period Low</h3>
          <div class="text-3xl font-bold text-white">
             <span class="text-yellow-400 text-xl mr-1">NT$</span>{{ minPrice?.toLocaleString(undefined, { maximumFractionDigits: 0 }) }}
          </div>
        </div>
      </div>

      <!-- Chart Section -->
      <div class="glass-card p-6 min-h-[400px]">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-bold text-white">Price History (TWD)</h2>
          <div class="text-xs text-white/40 flex items-center gap-2">
            <span>Exchange Rate: 1 USD ≈ {{ exchangeRate.toFixed(2) }} TWD</span>
            <span class="w-1 h-1 rounded-full bg-white/20"></span>
            <span>Source: FinMind API</span>
          </div>
        </div>

        <div v-if="loading" class="h-[300px] flex items-center justify-center">
             <div class="w-10 h-10 border-4 border-yellow-500/30 border-t-yellow-500 rounded-full animate-spin"></div>
        </div>
        
        <div v-else-if="error" class="h-[300px] flex items-center justify-center text-red-400">
          {{ error }}
        </div>

        <div v-else class="relative w-full aspect-8/3" ref="chartContainer" @mousemove="handleMouseMove" @mouseleave="handleMouseLeave">
          <svg :viewBox="`0 0 ${width} ${height}`" class="w-full h-full overflow-visible">
             <!-- Grid Lines -->
            <line v-for="i in 5" :key="i"
                  :x1="padding" 
                  :y1="padding + (i-1) * ((height - padding*2) / 4)" 
                  :x2="width - padding" 
                  :y2="padding + (i-1) * ((height - padding*2) / 4)" 
                  stroke="rgba(255,255,255,0.05)" 
                  stroke-dasharray="4" />

            <!-- Stats Label on Grid -->
            <text v-for="i in 5" :key="'label'+i"
                  :x="padding - 5" 
                  :y="padding + (i-1) * ((height - padding*2) / 4) + 4" 
                  fill="rgba(255,255,255,0.3)" 
                  font-size="10" 
                  text-anchor="end">
              {{ (maxPrice - (i-1) * ((maxPrice - minPrice)/4)).toLocaleString(undefined, { maximumFractionDigits: 0 }) }}
            </text>

            <!-- Gradient Area -->
            <defs>
              <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stop-color="#FBBF24" stop-opacity="0.3"/>
                <stop offset="100%" stop-color="#FBBF24" stop-opacity="0.0"/>
              </linearGradient>
            </defs>
            <path :d="`M${points.split(' ').join(' L')} L${width-padding},${height-padding} L${padding},${height-padding} Z`" fill="url(#chartGradient)" />

            <!-- The Line -->
            <polyline
              :points="points"
              fill="none"
              stroke="#FBBF24"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]"
            />

            <!-- Hover Effect -->
            <g v-if="hoveredPoint">
              <line :x1="getX(hoveredPoint)" :y1="padding" :x2="getX(hoveredPoint)" :y2="height - padding" 
                    stroke="rgba(255,255,255,0.2)" stroke-dasharray="4" />
              <circle :cx="getX(hoveredPoint)" :cy="getY(hoveredPoint)" r="6" fill="#FBBF24" stroke="white" stroke-width="2" />
            </g>
          </svg>

          <!-- Tooltip HTML overlay -->
          <div v-if="hoveredPoint" 
               class="absolute pointer-events-none bg-black/80 backdrop-blur-md border border-white/10 p-3 rounded-lg shadow-xl text-xs z-20 min-w-[120px]"
               :style="{ 
                 left: (getX(hoveredPoint) / width) * 100 + '%', 
                 top: (getY(hoveredPoint) / height) * 100 + '%',
                 transform: 'translate(-50%, -120%)'
               }">
            <div class="text-white/60 mb-1">{{ hoveredPoint.date }}</div>
            <div class="text-lg font-bold text-white flex items-center gap-1">
               <span class="text-yellow-400">NT$</span>{{ hoveredPoint.Price.toLocaleString(undefined, { maximumFractionDigits: 0 }) }}
            </div>
          </div>
        </div>
      </div>

       <!-- Recent Data Table -->
       <div class="glass-card overflow-hidden">
         <div class="p-6 border-b border-white/10">
           <h3 class="text-lg font-semibold text-white">Recent Transactions</h3>
         </div>
         <div class="overflow-x-auto">
           <table class="w-full text-left">
             <thead class="bg-white/5 text-xs uppercase text-white/40">
               <tr>
                 <th class="px-6 py-4 font-medium tracking-wider">Date & Time</th>
                 <th class="px-6 py-4 font-medium tracking-wider text-right">Price (TWD)</th>
                 <th class="px-6 py-4 font-medium tracking-wider text-right">Status</th>
               </tr>
             </thead>
             <tbody class="divide-y divide-white/5">
                <tr v-for="point in convertedData.slice().reverse().slice(0, 10)" :key="point.date" class="hover:bg-white/5 transition-colors">
                  <td class="px-6 py-4 text-white/70">{{ point.date }}</td>
                  <td class="px-6 py-4 text-right font-mono text-primary font-bold">NT$ {{ point.Price.toLocaleString(undefined, { maximumFractionDigits: 0 }) }}</td>
                  <td class="px-6 py-4 text-right">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-400">
                      Active
                    </span>
                  </td>
                </tr>
             </tbody>
           </table>
         </div>
       </div>

    </div>
  </div>
</template>
