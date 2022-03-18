import { PageWithHeader } from '../../layout/mainLayout/pageWithHeader/PageWithHeader'
import { useAbortController } from '../../api/api'

export const HomePage = () => {
  const constroller = useAbortController()

  return <PageWithHeader title='Flow Chart'>HomePage</PageWithHeader>
}
