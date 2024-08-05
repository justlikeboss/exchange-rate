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
  title: '黃金價格'
})

const timeFormat = (date) => {
  return new Intl.DateTimeFormat('fr-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date)
}

const {
  data: goldenList,
  pending,
  execute: doFetch
} = await useFetch('https://api.finmindtrade.com/api/v4/data', {
  query: {
    dataset: 'GoldPrice',
    end_date: timeFormat(new Date()),
    start_date: timeFormat(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
  },
  watch: false,
  immediate: false
})

onMounted(async () => {
  await doFetch()
})

</script>

<template>
<NuxtLayout>
  <section class="w-11/12 mx-auto mb-20">
    <div>
      <h1 class="font-bold text-center text-xl/loose mb-6">黃金價格</h1>
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
          <th class="p-2 text-left">黃金價格</th>
        </tr>
      </thead>
      <tbody>
        <tr class=" odd:bg-primary/10" v-for="item in goldenList.data.toReversed()">
          <td class="text-stone-600 p-2 md:p-3 text-xs md:text-sm lg:text-base">{{ item.date }}</td>
          <td class="text-stone-600 p-2 md:p-3 text-sm md:text-base lg:text-lg">{{ item.Price }}</td>
        </tr>
      </tbody>
    </table>
  </section>
</NuxtLayout>
</template>