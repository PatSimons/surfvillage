// Reverse DOM order
export const reverseDomElms = (parent: Element) => {
  if (parent) {
    const childElements = parent.children;
    const reversedChildElements = Array.from(childElements).reverse();

    reversedChildElements.forEach((child) => {
      parent.appendChild(child);
    });
  }
  console.log('meh');
};
