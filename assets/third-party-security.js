/* Third-party script security manager */

/**
 * Secure third-party script loader with CSP compliance
 * Manages Pop Convert and other analytics scripts safely
 */
class ThirdPartySecurityManager {
  constructor() {
    this.allowedDomains = [
      'script.pop-convert.com',
      'cdn.s3.pop-convert.com',
      'cdn.pop-convert.com',
      'cdn.micro.pop-convert.com',
      'micro.pop-convert.com',
      'static.cdninstagram.com',
      'www.instagram.com',
      'instagram.com'
    ];
    this.loadedScripts = new Set();
    this.init();
  }

  init() {
    this.monitorPopConvert();
    this.setupSecurityListeners();
    this.logThirdPartyActivity();
  }

  /**
   * Monitor Pop Convert script and ensure it's loading securely
   */
  monitorPopConvert() {
    if (globalThis.pc?.version) {
      this.validatePopConvertSecurity();
    }

    const checkPopConvert = () => {
      if (globalThis.pc && !this.loadedScripts.has('pop-convert')) {
        this.loadedScripts.add('pop-convert');
        this.validatePopConvertSecurity();
      }
    };

    const interval = setInterval(() => {
      checkPopConvert();
      if (this.loadedScripts.has('pop-convert')) {
        clearInterval(interval);
      }
    }, 1000);

    setTimeout(() => clearInterval(interval), 30000);
  }

  /**
   * Validate Pop Convert security configuration
   */
  validatePopConvertSecurity() {
    if (globalThis.pc) {
      this.protectCriticalElements();
      this.monitorDOMChanges();
    }
  }

  /**
   * Protect critical DOM elements from third-party modification
   */
  protectCriticalElements() {
    const criticalSelectors = [
      'script[src*="security-utils.js"]',
      'meta[http-equiv="Content-Security-Policy"]',
      'script[src*="constants.js"]',
      'script[src*="global.js"]'
    ];

    criticalSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        if (Object.freeze) {
          Object.freeze(element);
        }
      });
    });
  }

  /**
   * Monitor DOM changes for suspicious activity
   */
  monitorDOMChanges() {
    if (!globalThis.MutationObserver) return;

    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              this.validateNewElement(node);
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  /**
   * Validate newly added elements for security
   */
  validateNewElement(element) {
    if (element.tagName === 'SCRIPT') {
      const src = element.src;
      if (src && !this.isAllowedDomain(src)) {
        console.warn('[SECURITY] Blocked suspicious script:', src);
        element.remove();
        return;
      }
    }

    Array.from(element.attributes || []).forEach(attr => {
      if (attr.name.toLowerCase().startsWith('on')) {
        console.warn('[SECURITY] Removed inline event handler:', attr.name);
        element.removeAttribute(attr.name);
      }
    });
  }

  /**
   * Check if a domain is in the allowed list
   */
  isAllowedDomain(url) {
    try {
      const domain = new URL(url).hostname;
      return this.allowedDomains.some(allowed =>
        domain === allowed || domain.endsWith('.' + allowed)
      );
    } catch {
      return false;
    }
  }

  /**
   * Set up security event listeners
   */
  setupSecurityListeners() {
    document.addEventListener('securitypolicyviolation', (e) => {
      console.warn('[SECURITY] CSP Violation:', {
        violatedDirective: e.violatedDirective,
        blockedURI: e.blockedURI,
        documentURI: e.documentURI
      });
    });
  }

  /**
   * Handle security-related errors
   */
  handleSecurityError(message) {
    const harmlessErrors = [
      'Partitioned cookie or storage access',
      'Instagram',
      'cdninstagram.com',
      'Referrer Policy',
      'block-all-mixed-content',
      'csrftoken',
      'route config was null',
      'Pop Convert',
      '_shopify_test',
      '_shopify_s',
      '_fbp',
      'origin-when-cross-origin',
      'static.cdninstagram.com',
      'ErrorUtils caught an error',
      'blurred pcjs.production.min.js'
    ];

    const isHarmless = harmlessErrors.some(error => message.includes(error));

    if (!isHarmless) {
      if (globalThis.Shopify?.analytics) {
        try {
          globalThis.Shopify.analytics.publish('security_error', {
            message: message,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent
          });
        } catch {
          // Fail silently if analytics is not available
        }
      }
    }
  }

  /**
   * Log third-party activity for debugging
   */
  logThirdPartyActivity() {
    if (globalThis.location.hostname.includes('localhost') ||
        globalThis.location.search.includes('debug=true')) {

      console.log('[SECURITY] Third-party security manager initialized');
      console.log('[SECURITY] Monitoring domains:', this.allowedDomains);

      const originalAppendChild = Node.prototype.appendChild;
      Node.prototype.appendChild = function(child) {
        if (child.tagName === 'SCRIPT' && child.src) {
          console.log('[SECURITY] Script loaded:', child.src);
        }
        return originalAppendChild.call(this, child);
      };
    }
  }
}

// Initialize security manager when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    globalThis.__thirdPartySecurityInstance = new ThirdPartySecurityManager();
  });
} else {
  globalThis.__thirdPartySecurityInstance = new ThirdPartySecurityManager();
}

globalThis.__thirdPartySecurityManager = ThirdPartySecurityManager;
