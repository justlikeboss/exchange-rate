<script setup>
const affiliates = [
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

const year = new Date().getFullYear()
</script>

<template>
  <header class="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/20 backdrop-blur-lg">
    <nav class="container mx-auto px-6 h-16 flex items-center justify-between">
      <router-link to="/" class="flex items-center gap-3 group">
        <div class="p-1 rounded-lg bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors">
          <img src="./assets/logo.svg" class="w-6 h-6" alt="logo">
        </div>
        <span class="font-bold text-lg text-white tracking-tight">Exchange Rate <span class="text-primary">Pro</span></span>
      </router-link>
      
      <div class="flex items-center gap-6">
        <router-link to="/history" class="text-sm font-medium text-white/60 hover:text-white transition-colors" active-class="text-primary! font-bold">
          History
        </router-link>
        <router-link to="/gold-price" class="text-sm font-medium text-white/60 hover:text-white transition-colors" active-class="text-primary! font-bold">
          Gold Price
        </router-link>
      </div>
    </nav>
  </header>
  <main class="pt-20">
    <router-view />
  </main>
  <footer class="mt-20 border-t border-white/10 bg-black/20 backdrop-blur-md">
    <div class="container mx-auto px-6 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <!-- Brand Section -->
        <div class="md:col-span-2 space-y-4">
          <router-link to="/" class="flex items-center gap-3 w-fit">
            <div class="p-2 rounded-xl bg-white/5 border border-white/10">
              <img src="./assets/logo.svg" class="w-8 h-8" alt="logo">
            </div>
            <span class="font-bold text-xl text-white tracking-tight">Exchange Rate <span class="text-primary">Pro</span></span>
          </router-link>
          <p class="text-white/50 text-sm leading-relaxed max-w-sm">
            提供即時匯率換算與黃金價格走勢，助您精準掌握市場脈動，理財投資更輕鬆。
          </p>
        </div>

        <!-- Navigation -->
        <div>
          <h3 class="font-bold text-white mb-6">網站導覽</h3>
          <ul class="space-y-4">
            <li>
              <router-link to="/history" class="text-white/60 hover:text-primary transition-colors flex items-center gap-2 group">
                <span class="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-primary transition-colors"></span>
                歷史匯率
              </router-link>
            </li>
            <li>
              <router-link to="/gold-price" class="text-white/60 hover:text-primary transition-colors flex items-center gap-2 group">
                <span class="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-primary transition-colors"></span>
                黃金價格
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Partners -->
        <div>
          <h3 class="font-bold text-white mb-6">合作夥伴</h3>
          <ul class="space-y-4">
            <li v-for="affiliate in affiliates" :key="affiliate.id">
              <a :href="affiliate.url" target="_blank" class="text-white/60 hover:text-white transition-colors flex items-center gap-2 group">
                {{ affiliate.id }}
                <i class='bx bx-link-external text-xs opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all'></i>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <!-- Copyright -->
      <div class="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p class="text-white/40 text-sm">
          Copyright &copy; {{ year }} Exchange Rate Pro. All rights reserved.
        </p>
        <div class="flex items-center gap-4">
          <!-- Optional Social/Legal placeholders -->
        </div>
      </div>
    </div>
  </footer>
</template>
