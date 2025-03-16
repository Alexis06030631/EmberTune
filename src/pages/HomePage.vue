<template>
  <div class="welcome-container">
    <div class="charts-container">
      <h2 class="section-title">{{ t('home.trending') }} -
        <select class="select-input" @change="handleCountryChange">
          <option disabled selected>{{ t('home.trendingSelect.title') }}</option>
          <option v-for="country in countries" :key="country" :value="country">{{ country }}</option>
        </select>
      </h2>
      <div v-if="error" class="error">{{ error }}</div>
      <div class="charts-grid">
        <template v-if="loading">
          <SongCard
            v-for="n in 100"
            :key="n"
            skeleton
            title=""
            artist=""
            :thumbnail="[{ url: '', width: 0 }]"
            id=""
          />
        </template>
        <template v-else>
          <SongCard
            v-for="song in chartMusic"
            :key="song.id"
            :title="song.title"
            :thumbnail="song.thumbnails"
            :artist="song.artists[0].name"
            :id="song.id"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import SongCard from '../components/SongCard.vue'
import { useI18n } from 'vue-i18n'
import { ref, onMounted } from 'vue'
import {countries, countriesCodes} from 'ytmusic_api_unofficial'

const { t } = useI18n()
const chartMusic = ref([])
const loading = ref(true)
const error = ref(null)

const handleCountryChange = async (e) => {
  await loadCharts(countriesCodes[countries.indexOf(e.target.value)])
}

const loadCharts = async (countryCode) => {
  try {
    loading.value = true
    const charts = await window.youtube.getCharts(countryCode)
    chartMusic.value = charts.musics
  } catch (err) {
    error.value = err.message || 'Failed to load charts'
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await loadCharts('ZZ')
})
</script>

<style lang="scss" scoped>
.welcome-container {
  height: 100%;
  border-radius: 25px;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
  padding: 1.5rem;
}

.charts-container {
  width: 100%;
  max-width: 1200px;
}

.section-title {
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
  font-weight: 600;
  color: var(--text-color);
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 20px;
  width: 100%;
}

.loading,
.error {
  text-align: center;
  padding: 20px;
  color: var(--text-color);
  font-size: 1.1rem;
}

.select-input {
  height: fit-content;
  min-width: 120px;
  padding: 0 12px;
  border-radius: 6px;
  border: 1px solid var(--border-color, rgba(255, 255, 255, 0.12));
  background-color: var(--secondary-bg, #2a2a2a);
  color: var(--text-color, #ffffff);
  font-size: 14px;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='6' viewBox='0 0 12 6'%3E%3Cpath fill='%23dfe0e7' d='M6 6L0 0h12z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  cursor: pointer;

  .light-mode & {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='6' viewBox='0 0 12 6'%3E%3Cpath fill='%231a1a1a' d='M6 6L0 0h12z'/%3E%3C/svg%3E");
  }

  &:focus {
    outline: none;
    border-color: var(--accent-color);
  }
}
</style>
