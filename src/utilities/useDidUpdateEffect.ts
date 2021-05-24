import { useRef, useEffect, DependencyList } from 'react';

export default function useDidUpdateEffect(fn: () => void, inputs: DependencyList) {
	const didMountRef = useRef(false);

	useEffect(() => {
		if (didMountRef.current) fn();
		else didMountRef.current = true;
		//eslint-disable-next-line
	}, inputs);

	return true;
}
