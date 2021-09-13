// import { Ref, ref } from 'vue'
import api from '@/services/api'
import useTaskStore from '@/store/task'
import { TaskInfo,TaskFilter } from '@/models/task.model'
import { PageInfo } from '@/models/pager.model'
import qs from 'qs'

const { setTask,reset,isLoaded,getPage,setOffset,setCount,setPageInfo,getPageInfo } = useTaskStore()

let _filter: TaskFilter = {
}

interface TasksResposne {
  count: number;
  tasks: Array<TaskInfo>;
}

const loadTasks = async (pageInfo: PageInfo | null, filter: TaskFilter | null) => {
  if(pageInfo!=null)
    setPageInfo(pageInfo)
  if(filter!=null) {
    reset()
    _filter = filter
  }
  let offset = 0
  let length = 0
  const p = getPageInfo()
  for(let i = -1;i<=1;i++) {
    offset = (p.page+i-1) * p.size
    length = (2-i) * p.size
    if(offset<0 || p.count>0 && offset>=p.count || isLoaded(offset)) {
      length = 0
      continue
    }
    break
  }
  if(length==0)
    return
  const params = {
    skip: offset,
    limit: length,
    keywords: _filter.keywords,
    budgetGreaterEqual: _filter.minBudget,
    budgetLowerEqual: _filter.maxBudget,
    platforms: _filter.platforms
  }
  await api.get<TasksResposne>('tasks',{
      params:params,
      paramsSerializer: (params) => {
        return qs.stringify(params, { arrayFormat: 'repeat' })
      },
    })
    .then((response) => {
      if(response.data && response.data.tasks) {
        setCount(response.data.count + offset)
        response.data.tasks.forEach((t,i)=>{
          setTask(i+offset,t)
        })
      }
    })
}

const goPage = async (page: number) => {
  const p = getPageInfo()
  p.page = page
  setOffset((p.page-1)*p.size)
  await loadTasks(null, null)
}

const getTasks = () => {
  return getPage()
}

const getFilter = () => {
  return _filter
}

export default function useTaskController() {
  return {
    loadTasks,
    getPageInfo,
    goPage,
    getTasks,
    getFilter
  }
}
