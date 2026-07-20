import { db } from '@/api/localClient'

export const InvokeLLM = (...args) => db.integrations.Core.InvokeLLM(...args)
export const UploadFile = (...args) => db.integrations.Core.UploadFile(...args)
