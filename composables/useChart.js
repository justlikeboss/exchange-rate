import Chart from 'chart.js/auto'

export default (ctx, list) => {
  const chart = ref(null)
  let created = false

  const destroyChart = async () => {
    chart.value.destroy()
  }


  const createChart = async (data) => {
    chart.value = new Chart(ctx.value, {
      type: 'line',
      data,
      options: {
        responsive: true,
        interaction: {
          intersect: false,
          mode: 'index'
        }
      }
    })
    
    window.addEventListener('resize', ()=> {
      chart.value.resize()
    })

    created = true
  }

  return {
    chart,
    createChart,
    destroyChart
  }
}

const toChinese = {
  'cash_buy': '現金買入',
  'cash_sell': '現金賣出'
}