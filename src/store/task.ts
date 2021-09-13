import { Ref, ref } from 'vue'
import { TaskInfo } from '@/models/task.model'
import { PageInfo } from '@/models/pager.model'


const arrTasks: Ref<Array<TaskInfo | null> | []> = ref([]) 
const _offset: Ref<number> = ref(0)
const _pageInfo: Ref<PageInfo> = ref({
  page: 1,
  count: -1,
  size: 3
})

export default function useTaskStore() {
  const setOffset = (offset: number) => {
    _offset.value = offset
  }
  
  const setCount = (count: number) => {
    _pageInfo.value.count = count
  }

  const setPageInfo = (pageInfo: PageInfo) => {
    _pageInfo.value = pageInfo
  }
  
  const getPage = () => {
    return arrTasks.value.slice(_offset.value, _offset.value+_pageInfo.value.size)
  }

  const setTask = (index: number, task: TaskInfo) => { 
    arrTasks.value[index] = task
  }

  const isLoaded = (index: number) => {
    return arrTasks.value[index]!=null
  }

  const getOffset = () => {
    return _offset.value
  }

  const getPageInfo = () => {
    return _pageInfo.value
  }

  const reset = () => { arrTasks.value = [] }

  return {
    setTask,
    setOffset,
    setCount,
    setPageInfo,
    getPageInfo,
    getPage,
    reset,
    isLoaded,
    getOffset
  }
}
