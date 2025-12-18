'use client'

import { useEffect, useState } from 'react'

type DeviceType = 'mobile' | 'tablet' | 'laptop' | 'desktop'

interface UseDeviceReturn {
	device: DeviceType
	isMobileOrSmaller: boolean
	isTabletOrSmaller: boolean
	isLaptopOrSmaller: boolean
	isLoading: boolean
}

export const useDevice = (): UseDeviceReturn => {
	const [device, setDevice] = useState<DeviceType>('desktop')
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		const checkDevice = () => {
			const width = window.innerWidth
			if (width <= 767) {
				setDevice('mobile')
			} else if (width <= 1023) {
				setDevice('tablet')
			} else if (width <= 1440) {
				setDevice('laptop')
			} else {
				setDevice('desktop')
			}
			setIsLoading(false)
		}

		checkDevice()

		const mqMobile = window.matchMedia('(max-width: 767px)')
		const mqTablet = window.matchMedia('(max-width: 1023px)')
		const mqLaptop = window.matchMedia('(max-width: 1440px)')

		const handler = () => checkDevice()

		if (mqMobile.addEventListener)
			mqMobile.addEventListener('change', handler)
		else mqMobile.addListener(handler)
		if (mqTablet.addEventListener)
			mqTablet.addEventListener('change', handler)
		else mqTablet.addListener(handler)
		if (mqLaptop.addEventListener)
			mqLaptop.addEventListener('change', handler)
		else mqLaptop.addListener(handler)

		window.addEventListener('resize', checkDevice)

		return () => {
			if (mqMobile.removeEventListener)
				mqMobile.removeEventListener('change', handler)
			else mqMobile.removeListener(handler)
			if (mqTablet.removeEventListener)
				mqTablet.removeEventListener('change', handler)
			else mqTablet.removeListener(handler)
			if (mqLaptop.removeEventListener)
				mqLaptop.removeEventListener('change', handler)
			else mqLaptop.removeListener(handler)
			window.removeEventListener('resize', checkDevice)
		}
	}, [])

	return {
		device,
		isMobileOrSmaller: device === 'mobile',
		isTabletOrSmaller: device === 'mobile' || device === 'tablet',
		isLaptopOrSmaller:
			device === 'mobile' || device === 'tablet' || device === 'laptop',
		isLoading
	}
}
