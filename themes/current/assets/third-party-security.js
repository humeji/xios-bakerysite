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
    // Monitor for Pop Convert script loading
    this.monitorPopConvert();
    
    // Set up security event listeners
    this.setupSecurityListeners();
    
    // Log third-party activity for debugging
    this.logThirdPartyActivity();
  }

  /**
   * Monitor Pop Convert script and ensure it's loading securely
   */
  monitorPopConvert() {
    // Check if Pop Convert is already loaded
    if (globalThis.pc?.version) {
      // Pop Convert detected (logging suppressed)
      this.validatePopConvertSecurity();
    }

    // Monitor for Pop Convert initialization
    const checkPopConvert = () => {
      if (globalThis.pc && !this.loadedScripts.has('pop-convert')) {
        this.loadedScripts.add('pop-convert');
        // Pop Convert initialized securely (logging suppressed)
        this.validatePopConvertSecurity();
      }
    };

    // Check periodically for Pop Convert
    const interval = setInterval(() => {
      checkPopConvert();
      if (this.loadedScripts.has('pop-convert')) {
        clearInterval(interval);
      }
    }, 1000);

    // Clear interval after 30 seconds to prevent memory leaks
    setTimeout(() => clearInterval(interval), 30000);
  }

  /**
   * Validate Pop Convert security configuration
   */
  validatePopConvertSecurity() {
    if (globalThis.pc) {
      // Ensure Pop Convert is not modifying critical DOM elements
      this.protectCriticalElements();
      
      // Monitor for suspicious activity
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
        // Freeze element to prevent modification
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
    // Check for suspicious script injections
    if (element.tagName === 'SCRIPT') {
      const src = element.src;
      if (src && !this.isAllowedDomain(src)) {
        console.warn('[SECURITY] Blocked suspicious script:', src);
        element.remove();
        return;
      }
    }

    // Check for inline event handlers
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
    } catch (error) {
      console.debug('[SECURITY] Invalid URL passed to isAllowedDomain:', error.message);
      return false;
    }
  }

  // Console filtering is now handled directly in theme.liquid for immediate execution

  /**
   * Set up security event listeners
   */
  setupSecurityListeners() {
    // Listen for CSP violations
    document.addEventListener('securitypolicyviolation', (e) => {
      console.warn('[SECURITY] CSP Violation:', {
        violatedDirective: e.violatedDirective,
        blockedURI: e.blockedURI,
        documentURI: e.documentURI
      });
    });

    // Console filtering is now handled in setupConsoleFiltering()
  }

  /**
   * Handle security-related errors
   */
  handleSecurityError(message) {
    // Filter out known harmless errors and warnings
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
      // Log security errors for monitoring
      if (globalThis.Shopify?.analytics) {
        try {
          globalThis.Shopify.analytics.publish('security_error', {
            message: message,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent
          });
        } catch (error) {
          console.debug('[SECURITY] Analytics publish unavailable:', error.message);
        }
      }
    }
  }

  /**
   * Log third-party activity for debugging
   */
  logThirdPartyActivity() {
    // Only log in development or when debug is enabled
    if (globalThis.location.hostname.includes('localhost') || 
        globalThis.location.search.includes('debug=true')) {
      
      console.log('[SECURITY] Third-party security manager initialized');
      console.log('[SECURITY] Monitoring domains:', this.allowedDomains);
      
      // Log when scripts are loaded
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
function initSecurityManager() {
  const manager = new ThirdPartySecurityManager();
  globalThis.__thirdPartySecurityManager = manager;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSecurityManager);
} else {
  initSecurityManager();
}
