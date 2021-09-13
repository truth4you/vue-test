<template>
  <main>
    <h1>Tasks Search view</h1>
    <filter>
      <input v-model="keyword" placeholder="Search">
      <input type="number" v-model="minBudget" placeholder="Min Budget">
      <input type="number" v-model="maxBudget" placeholder="Max Budget">
      <label v-for="(platform,i) in PLATFORMS" :key="i">
        <input type="checkbox" :value="platform" v-model="platforms">
        {{platform}}
      </label>
      <button @click="search">Search</button>
    </filter>
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>title</th>
          <th>description</th>
          <th>budget</th>
          <th>proposal count</th>
          <th>platforms</th>
          <th>added</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(task,i) in tasks" :key="i">
          <template v-if="task && task.id">
            <td>{{(pageInfo.page-1)*pageInfo.size+i+1}}</td>
            <td>{{task.title}}</td>
            <td>{{task.description}}</td>
            <td>{{task.budget.value}}{{task.budget.currency}}</td>
            <td>{{task.proposalCount}}</td>
            <td>
              <span v-for="(i,p) in task.platforms" :class="i" :key="p"></span>
            </td>
            <td>
              {{formatDate(task.addedTime)}}
            </td>
          </template>
        </tr>
      </tbody>
    </table>
    <pagination>
      <button @click="goPrev" :disabled="!isLoaded || isFirst">Prev</button>
      <button v-for="page in pageCount" :key="page" @click="goPage(page)">{{page}}</button>
      <button @click="goNext" :disabled="!isLoaded || isLast">Next</button>
    </pagination>
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useTaskController from '@/middleware/controllers/useTaskController'
import { TaskFilter } from '@/models/task.model';
import { PageInfo } from '@/models/pager.model';
import useTaskStore from '@/store/task';
import { paramsToQueryString } from '@/services/api';

const { getOffset, getPageInfo } = useTaskStore();
const { goPage, loadTasks, getTasks, getFilter } = useTaskController();

export default defineComponent({ 
  name: 'TasksSearch',
  data() {
    return {
      PLATFORMS: ['INSTAGRAM', 'YOUTUBE', 'TWITCH', 'OTHER'],
      platforms: [],
      keyword: '',
      minBudget: '',
      maxBudget: ''
    }
  },
  computed: {
    filter() {
      return getFilter()
    },
    pageInfo() {
      return getPageInfo()
    },
    tasks() {
      return getTasks()
    },
    isLoaded() {
      return getPageInfo().count>-1
    },
    isFirst() {
      return getOffset()==0
    },
    isLast() {
      return getOffset()+getPageInfo().size>=getPageInfo().count
    },
    pageCount() {
      if(!this.isLoaded)
        return 0
      const pageInfo = getPageInfo()
      return parseInt(String(pageInfo.count / pageInfo.size)) + (pageInfo.count % pageInfo.size?1:0)
    }
  },
  mounted() {
    const query = this.$route.query as unknown
    const filter = query as TaskFilter
    if(filter.keywords)
      this.keyword = filter.keywords.join(' ')
    if(filter.platforms)
      this.platforms = filter.platforms as []
    if(filter.minBudget)
      this.minBudget = String(filter.minBudget)
    if(filter.maxBudget)
      this.maxBudget = String(filter.maxBudget)
    const pageInfo: PageInfo = query as PageInfo
    if(!pageInfo.page)
      pageInfo.page = 1
    else
      pageInfo.page = parseInt(String(pageInfo.page))
    pageInfo.size = 3
    pageInfo.count = -1
    loadTasks(pageInfo,filter)
  },
  methods: {
    goPrev() {
      goPage(this.pageInfo.page-1)
      this.setRoute()
    },
    goNext() {
      goPage(this.pageInfo.page+1)
      this.setRoute()
    },
    goPage(page: number) {
      goPage(page)
      this.setRoute()
    },
    search() {
      const filter = {
        minBudget: this.minBudget?parseFloat(this.minBudget):undefined,
        maxBudget: this.maxBudget?parseFloat(this.maxBudget):undefined,
        keywords: this.keyword.trim().split(/\s+/),
        platforms: this.platforms
      }
      loadTasks(this.pageInfo,filter)
      this.setRoute()
    },
    setRoute() {
      const filter = {
        keywords: this.keyword.trim().split(/\s+/),
        platforms: this.platforms,
        minBudget: this.minBudget,
        maxBudget: this.maxBudget,
        page: this.pageInfo.page,
      }
      this.$router.push('/tasks-search'+paramsToQueryString(filter))
    },
    formatDate(date: Date) {
      const now = new Date;
      let diff = Math.ceil((now.getTime() - new Date(date).getTime()) / 60000)
      if(diff==0)
        return 'added now'
      else if(diff<60)
        return 'added ' + diff + (diff==1?' minute':' minutes') + ' ago'
      else {
        diff = Math.ceil(diff / 60)
        if(diff<60)
          return 'added ' + diff + (diff==1?' hour':' hours') + ' ago'
        else {
          diff = Math.ceil(diff / 24 / 30)
          if(diff<12)
            return 'added ' + diff + (diff==1?' month':' months') + ' ago'
          else {
            diff = Math.ceil(diff / 12)
            return 'added ' + diff + (diff==1?' year':' years') + ' ago'
          }
        }
      }
    }
  }
})
</script>

<style scoped lang="scss">
  
</style>