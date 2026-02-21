/* Security utilities for safe DOM updates */

/**
 * Remove dangerous inline event handler attributes from an element subtree.
 * @param {Element} root
 */
function removeDangerousEventAttributes(root) {
  if (!root || !root.querySelectorAll) return;
  root.querySelectorAll('*').forEach((element) => {
    // Clone attributes array to avoid live collection issues
    Array.from(element.attributes).forEach((attr) => {
      if (attr && typeof attr.name === 'string' && attr.name.toLowerCase().startsWith('on')) {
        element.removeAttribute(attr.name);
      }
    });
  });
}

/**
 * Sanitize a container by removing <script> tags and inline event handler attributes.
 * @param {Element|DocumentFragment} root
 */
function sanitizeContainer(root) {
  if (!root) return;
  if (root.querySelectorAll) {
    root.querySelectorAll('script').forEach((script) => script.remove());
  }
  removeDangerousEventAttributes(root);
}

/**
 * Safely sets HTML contents on a target element.
 * - Parses provided HTML string in a temporary container
 * - Removes <script> tags and on* attributes
 * - Replaces children of the target element
 *
 * @param {Element|string} targetElement - Element or element id
 * @param {string} htmlContent
 */
function safeSetHTML(targetElement, htmlContent) {
  if (!targetElement) return;
  if (typeof targetElement === 'string') {
    targetElement = document.getElementById(targetElement);
  }
  if (!targetElement) return;

  const tempContainer = document.createElement('div');
  tempContainer.innerHTML = htmlContent || '';

  sanitizeContainer(tempContainer);

  targetElement.replaceChildren(...tempContainer.childNodes);
}

/**
 * Safely replace a target element with a sanitized clone of a source element.
 * Preserves the source element tag/attributes (minus dangerous ones) and subtree content.
 *
 * @param {Element} targetElement
 * @param {Element} sourceElement
 */
function safeReplaceWithSanitizedElement(targetElement, sourceElement) {
  if (!targetElement || !sourceElement) return;
  const clone = sourceElement.cloneNode(true);
  sanitizeContainer(clone);
  targetElement.replaceWith(clone);
}

// Expose to global scope for theme scripts
window.safeSetHTML = safeSetHTML;
window.safeReplaceWithSanitizedElement = safeReplaceWithSanitizedElement;
window.__xiosSecurityUtilsLoaded = true;


