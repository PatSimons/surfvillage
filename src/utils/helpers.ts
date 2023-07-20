// Null checker
// function elementExists(element: HTMLElement | null): element is HTMLElement {
//   return element !== null;
// }

// Reverse DOM order
export const reverseDomElms = (parent: Element) => {
  if (parent) {
    const childElements = parent.children;
    const reversedChildElements = Array.from(childElements).reverse();

    reversedChildElements.forEach((child) => {
      parent.appendChild(child);
    });
  }
};
