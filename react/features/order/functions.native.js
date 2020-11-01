import { NavigateSectionList } from '../base/react';

/**
 * Creates a displayable list item of a recent list entry.
 *
 * @private
 * @param {Object} item - The recent list entry.
 * @returns {Object}
 */
function toDisplayableItem(item) {
    return {
        colorBase: item,
        id: item,
        key: `key-${item}`,
        lines: [],
        title: item,
        url: item
    };
}

/**
 * Transforms the history list to a displayable list
 * with sections.
 *
 * @private
 * @param {Array<Object>} recentList - The recent list form the redux store.
 * @param {Function} t - The translate function.
 * @param {string} defaultServerURL - The default server URL.
 * @param {string} searchString - The search filter string.
 * @returns {Array<Object>}
 */
export function toDisplayableList(recentList, t, searchString) {
    const { createSection } = NavigateSectionList;
    const filterSection = createSection(t('order.filterlanguages'), 'Filtered');
    const allSection
        = createSection(t('order.alllanguages'), 'All');
    const filter = searchString === '' ? 0 : 1;
    for (const item of recentList) {
        const displayableItem = toDisplayableItem(item);
        if (filter && item.toLowerCase().match(RegExp(searchString.toLowerCase(),'gm')) !== null) {
            filterSection.data.push(displayableItem);         
        } else if(!filter) {
            allSection.data.push(displayableItem);         
        }
    }
    const displayableList = [];

    if (filter) {
        displayableList.push(filterSection);
    } else {
        displayableList.push(allSection);
    }

    return displayableList;
}