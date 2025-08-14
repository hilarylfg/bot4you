import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

export const useInDev = () => {
	const t = useTranslations()

	return () => toast(t('common.messages.inDev'), { duration: 3000 })
}
