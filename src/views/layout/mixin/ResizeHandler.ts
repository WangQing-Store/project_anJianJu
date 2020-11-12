import store from '@/store'
import { getCurrentInstance, onBeforeMount, onMounted, watch } from 'vue'

const { body } = document
const WIDTH = 1024
const RATIO = 3

export default {
  setup() {
    const {ctx}:any = getCurrentInstance()
    watch( ctx.$route, () => {
      if (ctx.device === 'mobile' && ctx.sidebar.opened) {
        store.dispatch('CloseSideBar', { withoutAnimation: false })
      }
    })
    onBeforeMount(() => {
       window.addEventListener('resize', ctx.resizeHandler)
    })  
    onMounted(() => {
        const isMobile= ctx.isMobile()
        if (isMobile) {
          store.dispatch('ToggleDevice', 'mobile')
          store.dispatch('CloseSideBar', { withoutAnimation: true })
        }
    })
    const isMobile = () => {
      const rect = body.getBoundingClientRect()
      return rect.width - RATIO < WIDTH
    }
    const resizeHandler = () => {
       if (!document.hidden) {
        const isMobile = ctx.isMobile()
        store.dispatch('ToggleDevice', isMobile ? 'mobile' : 'desktop')

        if (isMobile) {
          store.dispatch('CloseSideBar', { withoutAnimation: true })
        }
      }
    }
    return {
      resizeHandler,
      isMobile
    }
  }
}
