import 'express-session'
import { User } from 'prisma/__generated__'

declare module 'express-session' {
	interface SessionData {
		userId?: string
	}
}

declare module 'express-serve-static-core' {
	interface Request {
		user?: User
	}
}
