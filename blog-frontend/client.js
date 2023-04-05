import {createClient} from '@sanity/client'

export default createClient({
  projectId: 'p11b0jt2',
  dataset: 'production',
  apiVersion: '2021-03-25',
  useCdn: true,
})