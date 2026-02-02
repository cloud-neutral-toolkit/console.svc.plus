import type { DashboardExtension } from '../types'

import { userCenterExtension } from './user-center'
import { infraExtension } from './infra'

export const builtinExtensions: DashboardExtension[] = [
    userCenterExtension,
    infraExtension,
]
