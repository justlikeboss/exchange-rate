<script setup>

const { ogImage } = useAppConfig()

defineOgImageComponent(
  'NuxtSeo',
  {
    ...ogImage,
    siteLogo: '/logo.png'
  }
)
definePageMeta({
  title: '恐懼情緒'
})

const canvas = ref(undefined)

const {
  destroyChart,
  createChart
} = useChart(canvas)

const timeFormat = (date) => {
  return new Intl.DateTimeFormat('fr-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date)
}

const {
  data: greed,
  pending,
  execute: doFetch
} = await useFetch('https://api.finmindtrade.com/api/v4/data', {
  query: {
    dataset: 'CnnFearGreedIndex',
    end_date: timeFormat(new Date()),
    start_date: timeFormat(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
  },
  watch: false,
  immediate: false
})

const createChartData = (data) => {
  return {
    labels: data.map(row => row.date),
    datasets: [{
      label: '恐懼指數',
      data: data.map(row => row.fear_greed)
    }]
  }
}

onMounted(async () => {
  await doFetch()
  const chartData = createChartData(greed.value.data)
  console.log(chartData)
  createChart(chartData)
})

</script>

<template>
<NuxtLayout>
  <section class="w-11/12 mx-auto mb-20">
    <div>
      <h1 class="font-bold text-center text-xl/loose mb-6">恐懼情緒</h1>
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
          <th class="p-2 text-left">恐懼指數</th>
          <th class="p-2 text-left">恐懼情緒</th>
        </tr>
      </thead>
      <tbody>
        <tr class=" odd:bg-primary/10" v-for="item in greed.data.toReversed()">
          <td class="text-stone-600 p-2 md:p-3 text-xs md:text-sm lg:text-base">{{ item.date }}</td>
          <td class="text-stone-600 p-2 md:p-3 text-sm md:text-base lg:text-lg">{{ item.fear_greed }}</td>
          <td class="text-stone-600 p-2 md:p-3 text-sm md:text-base lg:text-lg">{{ item.fear_greed_emotion }}</td>
        </tr>
      </tbody>
    </table>
  </section>
</NuxtLayout>
</template>