import { Point, Rect, Side } from '../types/types'

const getSideCenter = (rect: Rect, side: Side): Point => {
	const { position, size } = rect
	const halfWidth = size.width / 2
	const halfHeight = size.height / 2

	switch (side) {
		case 'top':
			return { x: position.x, y: position.y - halfHeight }
		case 'bottom':
			return { x: position.x, y: position.y + halfHeight }
		case 'left':
			return { x: position.x - halfWidth, y: position.y }
		case 'right':
			return { x: position.x + halfWidth, y: position.y }
	}
}

const getRectBounds = (rect: Rect) => {
	const halfWidth = rect.size.width / 2
	const halfHeight = rect.size.height / 2

	return {
		left: rect.position.x - halfWidth,
		right: rect.position.x + halfWidth,
		top: rect.position.y - halfHeight,
		bottom: rect.position.y + halfHeight,
	}
}

const buildPath = (
	rect1: Rect,
	rect2: Rect,
	rect1Side: Side,
	rect2Side: Side
): Point[] => {
	const path: Point[] = []

	const startPoint = getSideCenter(rect1, rect1Side)
	const endPoint = getSideCenter(rect2, rect2Side)

	path.push(startPoint)

	const bounds1 = getRectBounds(rect1)
	const bounds2 = getRectBounds(rect2)

	const margin = 10

	switch (rect1Side) {
		case 'top':
			path.push({ x: startPoint.x, y: bounds1.top - margin })
			break
		case 'bottom':
			path.push({ x: startPoint.x, y: bounds1.bottom + margin })
			break
		case 'left':
			path.push({ x: bounds1.left - margin, y: startPoint.y })
			break
		case 'right':
			path.push({ x: bounds1.right + margin, y: startPoint.y })
			break
	}

	if (rect1Side === 'top' || rect1Side === 'bottom') {
		path.push({ x: endPoint.x, y: path[path.length - 1].y })
	} else {
		path.push({ x: path[path.length - 1].x, y: endPoint.y })
	}

	switch (rect2Side) {
		case 'top':
			path.push({ x: endPoint.x, y: bounds2.top - margin })
			break
		case 'bottom':
			path.push({ x: endPoint.x, y: bounds2.bottom + margin })
			break
		case 'left':
			path.push({ x: bounds2.left - margin, y: endPoint.y })
			break
		case 'right':
			path.push({ x: bounds2.right + margin, y: endPoint.y })
			break
	}

	path.push(endPoint)

	return path
}

export default buildPath
