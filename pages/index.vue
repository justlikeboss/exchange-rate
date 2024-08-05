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
  title: '匯星'
})

const currency = ref('TWD')
const currencyInfo = computed(() => countries.find(country => country.code === currency.value))
const currencyAmount = ref(1)

const targetCurrency = ref('KRW')
const targetCurrencyInfo = computed(() => countries.find(country => country.code === targetCurrency.value))

const changeCurrency = () => {
  currencyAmount.value = 100
  const newCurrency = targetCurrency.value
  const newTargetCurrency = currency.value
  currency.value = newCurrency
  targetCurrency.value = newTargetCurrency
}

const targetCurrencyAmount = computed(() => {
  if (loading.value || result.value === null) {
    return 0
  } else {
    return (currencyAmount.value * result.value.rates[targetCurrency.value]).toLocaleString()
  }
})

const { public: config } = useRuntimeConfig()

const URL = computed(() => config.API_URI + '/' + config.API_VERSION + '/latest/' + currency.value)

const {
  data: result,
  pending: loading
} = useFetch(URL)

const vFocus = {
  mounted: (el) => el.focus()
}
</script>

<template>
<NuxtLayout>
<section>
  <div class="max-w-4xl mx-auto w-4/5">
    <div class=" rounded-md shadow-md bg-white p-10">
      <div class=" flex items-center justify-between mb-10">
        <p class="text-xl">{{ targetCurrencyInfo.name }}</p>
        <p class=" relative">
          <select aria-label="select target currency code" id="targetCurrency-code" v-model="targetCurrency" class=" relative z-10 focus:border-primary border-b text-sm border-gray-300 min-w-0 outline-none appearance-none bg-transparent">
            <option v-for="country in countries" id="country.code" :value="country.code">{{ country.code }}{{ country.name }}</option>
          </select>
          <label class=" absolute right-0" for="targetCurrency-code"><i class='bx bx-chevron-down'></i></label>
        </p>
      </div>
      <div class=" relative">
        <span class="absolute top-2">
          <i class='bx bx-dollar bx-sm align-middle' ></i>
        </span>
        <p class="border-b-2 border-gray-300 text-4xl pl-6 line-clamp-1">{{ targetCurrencyAmount }}</p>
      </div>
    </div>
    <div class=" text-center -my-2">
      <button @click="changeCurrency" class="hover:opacity-80 relative z-10 text-center bg-primary text-white p-2 rounded-full shadow-xl" type="button">
        <i class='bx bx-transfer-alt bx-rotate-90 bx-sm align-middle' ></i>
      </button>
    </div>
    <div class=" rounded-md shadow-md bg-white p-10 mb-10">
      <div class=" flex items-center justify-between mb-10">
        <p class="text-xl">{{ currencyInfo.name }}</p>
        <p class=" relative">
          <select aria-label="select currency code" id="currency-code" v-model="currency" class=" relative z-10 focus:border-primary border-b text-sm border-gray-300 min-w-0 outline-none appearance-none bg-transparent">
            <option v-for="country in countries" id="country.code" :value="country.code">{{ country.code }}{{ country.name }}</option>
          </select>
          <label class=" absolute right-0" for="currency-code"><i class='bx bx-chevron-down'></i></label>
        </p>
      </div>
      <div class=" relative">
        <label for="currency" class="absolute top-2">
          <i class='bx bx-dollar bx-sm align-middle' ></i>
        </label>
        <input v-focus v-model.number="currencyAmount" type="tel" id="currency" class="text-4xl w-full pl-6 focus:border-primary border-b-2 border-gray-300 min-w-0 outline-none appearance-none bg-transparent">
      </div>
    </div>
    <div class=" text-center">
      <ClientOnly>
        <p class="text-stone-600" v-if="loading"><i class='bx bx-loader bx-spin' ></i></p>
        <p class="text-stone-600" v-else>1 {{ currency }} = {{ result.rates[targetCurrency].toLocaleString() }} {{ targetCurrency }}</p>
      </ClientOnly>
    </div>
    <datalist id="country-code">
      <option v-for="country in countries" id="country.code" :value="country.code">{{ country.name }}</option>
    </datalist>
  </div>
</section>
</NuxtLayout>
</template>