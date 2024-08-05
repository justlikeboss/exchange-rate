<script setup>
import countries from '../assets/country.json'
const { ogImage } = useAppConfig()

defineOgImageComponent(
  'NuxtSeo',
  {
    ...ogImage,
    siteLogo: '/logo.png'
  }
)

definePageMeta({
  title: '歷史匯率'
})

const canvas = ref(undefined)
const currency = ref('JPY')

const timeFormat = (date) => {
  return new Intl.DateTimeFormat('fr-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date)
}

const {
  data: exchangeList,
  pending,
  execute: doFetch
} = await useFetch('https://api.finmindtrade.com/api/v4/data', {
  query: {
    dataset: 'TaiwanExchangeRate',
    end_date: timeFormat(new Date()),
    start_date: timeFormat(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)),
    data_id: currency
  },
  watch: false,
  immediate: false
})


const {
  destroyChart,
  createChart
} = useChart(canvas)

const toChinese = {
  'cash_buy': '現金買入',
  'cash_sell': '現金賣出'
}
const createChartData = (data) => {
  return {
    labels: data.map(row => row.date),
    datasets: [{
      label: toChinese['cash_buy'],
      data: data.map(row => row.cash_buy)
    }, {
      label: toChinese['cash_sell'],
      data: data.map(row => row.cash_sell)
    }]
  }
}

watch(currency, async () => {
  await destroyChart()
  await doFetch()
  const chartData = createChartData(exchangeList.value.data)
  await createChart(chartData)
})

onMounted(async () => {
  await doFetch()
  const chartData = createChartData(exchangeList.value.data)
  createChart(chartData)
})
</script>

<template>
<NuxtLayout>
  <section class="w-11/12 mx-auto mb-20">
    <div>
      <h1 class="font-bold text-center text-xl/loose mb-6">歷史匯率</h1>
    </div>
    <div class=" text-center mb-10 space-x-6">
      <p class="text-sm inline-block">TWD 新台幣</p>
      <span>
        <i class='bx bx-transfer-alt align-middle' ></i>
      </span>
      <p class="relative inline-block">
        <select v-model="currency" aria-label="select target currency code" id="targetCurrency-code" class=" relative z-10 focus:border-primary border-b text-sm border-gray-300 min-w-0 outline-none appearance-none bg-transparent">
          <option v-for="country in countries" id="country.code" :value="country.code">{{ country.code }}{{ country.name }}</option>
        </select>
        <label class=" absolute right-0" for="targetCurrency-code"><i class='bx bx-chevron-down'></i></label>
      </p>
    </div>
    <p v-show="pending" class=" text-center">
      <i class='bx bx-loader bx-spin' ></i>
    </p>
    <div class="mb-10">
      <canvas v-show="!pending" ref="canvas" class="w-full max-h-96"/>
    </div>
  </section>
  <section class="w-11/12 mx-auto">
    <p v-if="pending" class=" text-center">
      <i class='bx bx-loader bx-spin' ></i>
    </p>
    <table v-else class="table-auto w-full max-w-4xl mx-auto">
      <thead>
        <tr class="bg-primary/50 text-stone-700">
          <th class="p-2 text-left">日期</th>
          <th class="p-2 text-left">現金買入</th>
          <th class="p-2 text-left">現金賣出</th>
          <th class="p-2 text-left">即期買入</th>
          <th class="p-2 text-left">即期賣出</th>
        </tr>
      </thead>
      <tbody>
        <tr class=" odd:bg-primary/10" v-for="item in exchangeList.data.toReversed()">
          <td class="text-stone-600 p-2 md:p-3 text-xs md:text-sm lg:text-base">{{ item.date }}</td>
          <td class="text-stone-600 p-2 md:p-3 text-sm md:text-base lg:text-lg">{{ item.cash_buy }}</td>
          <td class="text-stone-600 p-2 md:p-3 text-sm md:text-base lg:text-lg">{{ item.cash_sell }}</td>
          <td class="text-stone-600 p-2 md:p-3 text-sm md:text-base lg:text-lg">{{ item.spot_buy }}</td>
          <td class="text-stone-600 p-2 md:p-3 text-sm md:text-base lg:text-lg">{{ item.spot_sell }}</td>
        </tr>
      </tbody>
    </table>
  </section>
</NuxtLayout>
</template>