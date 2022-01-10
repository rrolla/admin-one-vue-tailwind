<template>
  <title-bar :title-stack="titleStack"/>
  <hero-bar>Dashboard</hero-bar>

  <main-section>
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-6">
      <card-widget
        color="text-red-500"
        :icon="mdiChartTimelineVariant"
        :number="stats.total"
        label="Total"
      />
      <card-widget
        color="text-green-500"
        :icon="mdiAccountMultiple"
        :number="stats.viewers"
        label="Viewers"
      />
      <card-widget
        color="text-blue-500"
        :icon="mdiChartTimelineVariant"
        :number="stats.guests"
        label="Guests"
      />
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
      <div class="flex flex-col justify-between">
        <card-transaction-bar
          v-for="(transaction,index) in transactionBarItems"
          :key="index"
          :amount="transaction.amount"
          :date="transaction.date"
          :business="transaction.business"
          :type="transaction.type"
          :name="transaction.name"
          :account="transaction.account"
        />
      </div>
      <div class="flex flex-col justify-between">
        <card-client-bar
          v-for="client in clientBarItems"
          :key="client.id"
          :name="client.name"
          :login="client.login"
          :date="client.created"
          :progress="client.progress"
        />
      </div>
    </div>

    <card-component
      title="Stats"
      :icon="mdiFinance"
      :header-icon="mdiReload"
      class="mb-6"
      @header-icon-click="fillChartData"
    >
      <!--      <div v-if="chartData">-->
      <!--        <line-chart-->
      <!--          :data="chartData"-->
      <!--          class="h-96"-->
      <!--        />-->
      <!--      </div>-->
      <div id="widgetIframe" class="grid grid-cols-4">
        <div>
          <iframe
            width="100%"
            height="350"
            :src="`${matomo.url}index.php?module=Widgetize&action=iframe&disableLink=0&widget=1&moduleToWidgetize=Live&actionToWidgetize=getSimpleLastVisitCount&idSite=${matomo.id}&period=day&date=yesterday&disableLink=1&widget=1&token_auth=${matomo.token}`"
            scrolling="yes"
            frameborder="0"
            marginheight="0"
            marginwidth="0">
          </iframe>
        </div>
        <div>
          <iframe
            width="100%"
            height="350"
            :src="`${matomo.url}index.php?module=Widgetize&action=iframe&disableLink=0&widget=1&moduleToWidgetize=UserCountryMap&actionToWidgetize=realtimeMap&idSite=${matomo.id}&period=day&date=yesterday&disableLink=1&widget=1&token_auth=${matomo.token}`"
            scrolling="yes"
            frameborder="0"
            marginheight="0"
            marginwidth="0">
          </iframe>
        </div>
        <div>
          <iframe
            width="100%"
            height="350"
            :src="`${matomo.url}index.php?module=Widgetize&action=iframe&disableLink=0&widget=1&moduleToWidgetize=Live&actionToWidgetize=widget&idSite=${matomo.id}&period=day&date=yesterday&disableLink=1&widget=1&token_auth=${matomo.token}`"
            scrolling="yes"
            frameborder="0"
            marginheight="0"
            marginwidth="0">
          </iframe>
        </div>
        <div>
          <iframe
            width="100%"
            height="350"
            :src="`${matomo.url}index.php?module=Widgetize&action=iframe&secondaryDimension=eventAction&disableLink=0&widget=1&moduleToWidgetize=Events&actionToWidgetize=getName&idSite=${matomo.id}&period=day&date=yesterday&disableLink=1&widget=1&token_auth=${matomo.token}`"
            scrolling="yes"
            frameborder="0"
            marginheight="0"
            marginwidth="0">
          </iframe>
        </div>
      </div>
    </card-component>
  </main-section>
</template>

<script>

import {computed, onMounted, reactive, ref} from 'vue'
import {useStore} from 'vuex'
import {mdiAccountMultiple, mdiCartOutline, mdiChartPie, mdiChartTimelineVariant, mdiFinance, mdiReload} from '@mdi/js'
import * as chartConfig from '../components/Charts/chart.config.js'
import MainSection from '../components/MainSection.vue'
import TitleBar from '../components/TitleBar.vue'
import HeroBar from '../components/HeroBar.vue'
import CardWidget from '../components/CardWidget.vue'
import CardComponent from '../components/CardComponent.vue'
import CardTransactionBar from '../components/CardTransactionBar.vue'
import CardClientBar from '../components/CardClientBar.vue'
import TitleSubBar from '../components/TitleSubBar.vue'
import {isEmpty} from "lodash";

export default {
  setup() {

    const titleStack = ref(['Admin', 'Dashboard'])
    const chartData = ref(null)

    const fillChartData = () => {
      chartData.value = chartConfig.sampleChartData()
    }

    onMounted(() => {
      fillChartData()
    })

    const store = useStore()
    const clientBarItems = computed(() => store.state.clients.slice(0, 3))
    const transactionBarItems = computed(() => store.state.history.slice(0, 3))
    const darkMode = computed(() => store.state.darkMode)
    const matomo = reactive(window.matomo);

    store.dispatch('fetchStreamsStats');
    const stats = computed(() => {
      const viewers = !isEmpty(store.state.streamsStats) ? store.state.streamsStats.find((stat) => stat.users === 'viewers')?.count : 0;
      const guests = !isEmpty(store.state.streamsStats) ? store.state.streamsStats.find((stat) => stat.users === 'guests')?.count : 0;
      return {
        'viewers': viewers,
        'guests': guests,
        'total': viewers + guests,
      }
    });

    const intervalMinutes = 1;
    const intervalID = ref(null);
    const startInterval = () => {
      intervalID.value = setInterval(() => store.dispatch('fetchStreamsStats'), intervalMinutes * 60 * 1000);
    }

    startInterval()

    return {
      clientBarItems,
      transactionBarItems,
      darkMode,
      titleStack,
      mdiAccountMultiple,
      mdiCartOutline,
      mdiChartPie,
      mdiChartTimelineVariant,
      mdiFinance,
      mdiReload,
      stats,
      matomo,
    }
  },

  components: {
    MainSection,
    CardWidget,
    TitleBar,
    HeroBar,
    CardComponent,
    CardTransactionBar,
    CardClientBar,
    TitleSubBar,
  },
}
</script>

