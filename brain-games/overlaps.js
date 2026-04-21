/**
 * Test whether two ranges overlap.
 * @param {min1} number - the minimum value in the first range
 * @param {max1} number - the maximum value in the first range
 * @param {min2} number - the minimum value in the second range
 * @param {max2} number - the maximum value in the second range
 * @throws {Error} if a range's minimum is greater than its maximum
 * @return {boolean} true if there are any numbers in both
 * the first and second range, false otherwise
 */
function overlaps(min1, max1, min2, max2) {
    if (min1 > max1 || min2 > max2) {
	throw new Error('Invalid range: minimum is greater than maximum');
    }

    return max1 >= min2 && max2 >= min1;
}

module.exports = overlaps;
