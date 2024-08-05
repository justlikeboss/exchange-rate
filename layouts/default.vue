<template>
  <header class="sticky top-0 mb-4 backdrop-blur-3xl z-20">
    <div class=" max-w-6xl mx-auto w-5/6 py-3 flex items-center justify-between">
      <NuxtLink class="btn btn-ghost" to="/">
        <img class=" inline-block align-middle w-6" src="../assets/logo.svg" alt="logo">
        <span class="ml-3 text-md align-middle font-bold">{{ appConfig.title }}</span>
      </NuxtLink>
      <nav>
        <div class="dropdown dropdown-end">
          <div tabindex="0" role="button" class="btn btn-sm btn-ghost m-1"><i class='bx bx-menu'></i></div>
          <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
            <li v-for="item in navs">
              <NuxtLink class="text-sm" :to="item.url">{{ item.name }}</NuxtLink>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  </header>
  <main class="mb-20">
    <slot/>
  </main>
  <footer class="py-10 bg-gradient-to-b from-transparent to-25% to-stone-100">
    <div class="max-w-6xl mx-auto w-5/6">
      <div class="grid gap-10 grid-cols-2 md:grid-cols-4 mb-10">
        <div>
          <h3 class="mb-4">
            <NuxtLink class="btn btn-ghost group" to="/">
              <img class="grayscale group-hover:grayscale-0 inline-block align-middle w-6" src="../assets/logo.svg" alt="logo">
              <span class="ml-3 text-md align-middle text-stone-500">{{ appConfig.title }}</span>
            </NuxtLink>
          </h3>
          <p>
            <a class="text-stone-500 btn btn-ghost btn-sm" href="mailto:contact@justlikeboss.com">
              <i class='bx bx-envelope bx-sm'></i>
            </a>
          </p>
          <p>
            <a class=" hover:underline text-xs text-stone-400"  href="https://www.exchangerate-api.com" target="_blank" rel="noopener noreferrer">Rates By Exchange Rate API<i class='bx bx-link-external'></i></a>
          </p>
        </div>
        <div class="md:col-start-2">
          <h3 class="mb-4"><i class='bx bx-heart'></i>合作夥伴</h3>
          <p class="mb-3 last:mb-0 text-sm text-stone-500" v-for="affiliate in affiliates">
            <a class="hover:underline" :href="affiliate.url" target="_blank" rel="noopener noreferrer">
              <span>{{ affiliate.id }}</span>
              <i class='bx bx-link-external'></i>
            </a>
          </p>
        </div>
        <div class="md:col-start-3">
          <h3 class="mb-4"><i class='bx bx-globe'></i>頁面</h3>
          <p class="mb-3 last:mb-0 text-sm text-stone-500" v-for="page in navs">
            <NuxtLink class=" hover:underline" :to="page.url">{{ page.name }}</NuxtLink>
          </p>
        </div>
        <div class="md:col-start-4">
          <h3 class="mb-4"><i class='bx bx-desktop'></i>品牌</h3>
          <p class="mb-3 last:mb-0 text-stone-500 text-sm" v-for="link in brands">
            <a class="hover:underline" :href="link.url" target="_blank">{{ link.name }}<i class='bx bx-link-external'></i></a>
          </p>
        </div>
      </div>
      <div class=" py-10">
        <p class="text-sm text-stone-500">
          <NuxtLink class="btn btn-ghost" to="/">
            Copyright <i class='bx bx-copyright align-middle'></i> 2024 {{ appConfig.title }}
          </NuxtLink>
        </p>
      </div>
    </div>
  </footer>
</template>
<script setup>
const appConfig = useAppConfig()
const navs = [
  {
    url: '/history',
    name: '歷史匯率'
  },
  {
    url: '/emotion',
    name: '恐懼情緒'
  },
  {
    url: '/golden',
    name: '黃金價格'
  }
]

const {
  data: brands
} = useFetch('/api/brands.json')

const affiliates = [
  {
    url: 'https://blog.justlikeboss.com/shopee-coupon/',
    id: '蝦皮折扣碼'
  },
  {
    id: 'Booking.com',
    url: 'https://reurl.cc/3XknOO'
  },
  {
    id: 'kkday',
    url: 'https://reurl.cc/LW2OAa',
    img: '/affiliate/kkday.png'
  },
  {
    id: 'KLOOK',
    url: 'https://reurl.cc/6vGmQ5'
  },
  {
    id: 'Trip.com',
    url: 'https://reurl.cc/xaWmLE'
  }
]
</script>