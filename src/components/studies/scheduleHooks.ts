import {useUserSessionDataState} from '@helpers/AuthContext'
import ScheduleService from '@services/schedule.service'
import {Schedule} from '@typedefs/scheduling'
import {useMutation, useQuery, useQueryClient} from 'react-query'
import {STUDY_KEYS} from './studyHooks'

const SCHEDULE_KEYS = {
  all: ['schedules'] as const,
  list: () => [...SCHEDULE_KEYS.all, 'list'] as const,
  // list: (filters: string) => [...todoKeys.lists(), { filters }] as const,
  details: () => [...SCHEDULE_KEYS.all, 'detail'] as const,
  detail: (id: string | undefined) => [...SCHEDULE_KEYS.details(), id] as const,
}

export const useSchedule = (studyId: string | undefined) => {
  const {token} = useUserSessionDataState()

  return useQuery<Schedule | undefined, Error>(
    SCHEDULE_KEYS.detail(studyId),
    () => ScheduleService.getSchedule(studyId!, token!),
    {
      enabled: !!studyId,
      retry: false,
      refetchOnWindowFocus: false,
    }
  )
}
export const useUpdateSchedule = () => {
  const {token} = useUserSessionDataState()
  const queryClient = useQueryClient()

  const update = async (props: {
    studyId: string
    schedule: Schedule

    action: 'UPDATE' | 'CREATE'
  }): Promise<Schedule> => {
    const {studyId, schedule, action} = props
    if (action === 'UPDATE') {
      return ScheduleService.saveSchedule(studyId, schedule, token!)
    } else {
      return ScheduleService.createSchedule(studyId, schedule, token!)
    }
  }

  const mutation = useMutation(update, {
    onMutate: async props => {
      queryClient.cancelQueries(SCHEDULE_KEYS.detail(props.studyId))
      queryClient.cancelQueries(STUDY_KEYS.detail(props.studyId))
      // Snapshot the previous value
      const {studyId, schedule, action} = props
      const previousSchedule = queryClient.getQueryData<Schedule>(
        SCHEDULE_KEYS.detail(studyId)
      )

      queryClient.setQueryData<Schedule>(SCHEDULE_KEYS.detail(studyId), {
        ...schedule,
      })

      return {previousSchedule}
    },
    onError: (err, variables, context) => {
      console.log(err, variables, context)
      /* if (context?.previousStudies) {
          queryClient.setQueryData<Study[]>(KEYS.studies, context.previousStudies)
        }*/
    },
    onSettled: async (data, error, args) => {
      queryClient.invalidateQueries(SCHEDULE_KEYS.detail(args.studyId))
      queryClient.invalidateQueries(STUDY_KEYS.detail(args.studyId))
    },
  })

  return mutation
}
