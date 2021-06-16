import _Vue from 'vue'
import KomgaSseService from "@/services/komga-sse.service"

export default {
  install(
    Vue: typeof _Vue,
    {eventHub, store}: { eventHub: _Vue, store: any },
  ) {
    Vue.prototype.$komgaSse = new KomgaSseService(eventHub, store)
  },
}

declare module 'vue/types/vue' {
  interface Vue {
    $komgaSse: KomgaSseService;
  }
}
