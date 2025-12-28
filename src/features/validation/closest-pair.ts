import { type Vector3 } from '@skybrush/show-format';
import minBy from 'lodash-es/minBy';

// in my measurements, timsort was slightly better than the built-in JS sort
// and also faster than fast-sort. This may change later; it's worth re-running
// the benchmark every now and then.
import { sort } from 'timsort';

type OrderedPoints = {
  orderedByX: Vector3[];
  orderedByY: Vector3[];
};

function getDistanceSquared(pair: [Vector3, Vector3]) {
  return (
    (pair[0].x - pair[1].x) ** 2 +
    (pair[0].y - pair[1].y) ** 2 +
    (pair[0].z - pair[1].z) ** 2
  );
}

function getPointsOrderedByY(
  minX: number,
  maxX: number,
  allPointsOrderedByY: Vector3[]
) {
  return allPointsOrderedByY.filter((p) => p.x >= minX && p.x < maxX);
}

function mergeSortedArraysByY(array1: Vector3[], array2: Vector3[]): Vector3[] {
  const mergedArray: Vector3[] = [];
  const array1Length = array1.length;
  const array2Length = array2.length;

  let i = 0;
  let j = 0;

  while (i < array1Length && j < array2Length) {
    if (array1[i].y <= array2[j].y) {
      mergedArray.push(array1[i]);
      i++;
    } else {
      mergedArray.push(array2[j]);
      j++;
    }
  }

  if (i < array1Length) {
    mergedArray.push(...array1.slice(i));
  } else {
    mergedArray.push(...array2.slice(j));
  }

  return mergedArray;
}

function divide({ orderedByX, orderedByY }: OrderedPoints): {
  left: OrderedPoints;
  right: OrderedPoints;
} {
  const half = Math.floor(orderedByX.length / 2);
  const splitCoordinate = orderedByX[half].x;
  const leftByX = orderedByX.slice(0, half);
  const leftByY = getPointsOrderedByY(
    Number.NEGATIVE_INFINITY,
    splitCoordinate,
    orderedByY
  );
  const rightByX = orderedByX.slice(half);
  const rightByY = getPointsOrderedByY(
    splitCoordinate,
    Number.POSITIVE_INFINITY,
    orderedByY
  );

  return {
    left: { orderedByX: leftByX, orderedByY: leftByY },
    right: { orderedByX: rightByX, orderedByY: rightByY },
  };
}

function baseCase(points: Vector3[]): [Vector3, Vector3] {
  if (points.length === 2) {
    return points as [Vector3, Vector3];
  }

  const combinations: Array<[Vector3, Vector3]> = [
    [points[0], points[1]],
    [points[0], points[2]],
    [points[1], points[2]],
  ];

  return minBy(combinations, getDistanceSquared)!;
}

function getCandidates(orderedByY: Vector3[], minX: number, maxX: number) {
  return orderedByY.filter((p) => p.x > minX && p.x < maxX);
}

function getClosestPairInIntersection(points: Vector3[]) {
  let minDistSq = Number.POSITIVE_INFINITY;
  let closestPair: [Vector3, Vector3];
  const numberOfPoints = points.length;

  for (let i = 0; i < numberOfPoints; i++) {
    for (let j = i + 1; j < numberOfPoints && j - i <= 15; j++) {
      const pair: [Vector3, Vector3] = [points[i], points[j]];
      const distanceSq = getDistanceSquared(pair);
      if (distanceSq < minDistSq) {
        minDistSq = distanceSq;
        closestPair = pair;
      }
    }
  }

  return closestPair!;
}

function combine(
  left: OrderedPoints,
  right: OrderedPoints,
  closestOnLeft: [Vector3, Vector3],
  closestOnRight: [Vector3, Vector3]
) {
  const closestPair = minBy(
    [closestOnLeft, closestOnRight],
    getDistanceSquared
  )!;
  const minDist = Math.sqrt(getDistanceSquared(closestPair));
  const allOrderedByY = mergeSortedArraysByY(left.orderedByY, right.orderedByY);
  const frontierPoint = left.orderedByX.at(-1);
  const candidatesByY = getCandidates(
    allOrderedByY,
    frontierPoint!.x - minDist,
    frontierPoint!.x + minDist
  );
  const closestInIntersection = getClosestPairInIntersection(candidatesByY);

  if (!closestInIntersection) {
    return closestPair;
  }

  return minBy([closestPair, closestInIntersection], getDistanceSquared)!;
}

/**
 * Function that returns the closest pair of points, given an input array of points.
 *
 * A precondition of using this function is that there must be at least two
 * points in the input.
 */
function getClosestPairOrdered(points: OrderedPoints): [Vector3, Vector3] {
  if (points.orderedByX.length <= 3) {
    return baseCase(points.orderedByX);
  }

  const subproblems = divide(points);
  const closestOnLeft = getClosestPairOrdered(subproblems.left);
  const closestOnRight = getClosestPairOrdered(subproblems.right);

  return combine(
    subproblems.left,
    subproblems.right,
    closestOnLeft,
    closestOnRight
  ); // O(n)
}

function orderByX(points: Vector3[]) {
  const result = points.concat();
  sort(result, (a, b) => a.x - b.x);
  return result;
}

function orderByY(points: Vector3[]) {
  const result = points.concat();
  sort(result, (a, b) => a.y - b.y);
  return result;
}

function getClosestPair(points: Vector3[]) {
  if (points.length < 2) {
    return undefined;
  }

  return getClosestPairOrdered({
    orderedByX: orderByX(points),
    orderedByY: orderByY(points), // O(n log n)
  });
}

export default getClosestPair;
