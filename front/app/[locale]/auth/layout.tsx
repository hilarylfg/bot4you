import { Bot } from 'lucide-react'
import { ReactNode } from 'react'

import {
	Card,
	CardContent,
	Squares,
	TermsAndPrivacy
} from '@/shared/components'

interface Props {
	children: ReactNode
}

export default function AuthLayout({ children }: Props) {
	return (
		<div className='auth-page'>
			<div className='auth-page__container'>
				<div className={'auth-form'}>
					<Card className='auth-form__card'>
						<CardContent className='auth-form__content'>
							<form className='auth-form__form'>
								<div className='auth-form__form-inner'>
									{children}
								</div>
							</form>
							<div className='auth-form__fun-section'>
								<Bot
									className='auth-form__fun-section__logo'
									size={280}
								/>
								<Squares
									speed={0.4}
									squareSize={40}
									direction='diagonal'
									className='auth-form__fun-section__squares'
								/>
							</div>
						</CardContent>
					</Card>
					<TermsAndPrivacy />
				</div>
			</div>
		</div>
	)
}
