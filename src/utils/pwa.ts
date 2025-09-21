// PWA utility functions for NiroGuard
export interface InstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: any;
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
  requireInteraction?: boolean;
}

export interface OfflineData {
  id: string;
  type: 'health-report' | 'water-quality' | 'case-update';
  data: any;
  timestamp: number;
  retryCount: number;
}

class PWAManager {
  private installPrompt: InstallPromptEvent | null = null;
  private isInstalled = false;
  private registration: ServiceWorkerRegistration | null = null;

  constructor() {
    this.init();
  }

  // Initialize PWA functionality
  async init() {
    // Check if app is installed
    this.checkInstallStatus();
    
    // Register service worker
    await this.registerServiceWorker();
    
    // Set up install prompt
    this.setupInstallPrompt();
    
    // Set up update checking
    this.setupUpdateChecking();
    
    // Set up offline data sync
    this.setupOfflineSync();
  }

  // Service Worker Registration
  async registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
    if (!('serviceWorker' in navigator)) {
      console.log('Service Worker not supported');
      return null;
    }

    try {
      this.registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });

      console.log('Service Worker registered successfully:', this.registration);

      // Handle service worker updates
      this.registration.addEventListener('updatefound', () => {
        const newWorker = this.registration?.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                // New update available
                this.notifyUpdateAvailable();
              }
            }
          });
        }
      });

      return this.registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return null;
    }
  }

  // Install Prompt Management
  private setupInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (e: Event) => {
      e.preventDefault();
      this.installPrompt = e as InstallPromptEvent;
      this.showInstallBanner();
    });

    window.addEventListener('appinstalled', () => {
      this.isInstalled = true;
      this.hideInstallBanner();
      this.trackInstallEvent();
    });
  }

  // Show install app prompt
  async showInstallPrompt(): Promise<boolean> {
    if (!this.installPrompt) {
      return false;
    }

    try {
      await this.installPrompt.prompt();
      const result = await this.installPrompt.userChoice;
      
      if (result.outcome === 'accepted') {
        console.log('User accepted install prompt');
        return true;
      } else {
        console.log('User dismissed install prompt');
        return false;
      }
    } catch (error) {
      console.error('Install prompt failed:', error);
      return false;
    }
  }

  // Check if app is installed
  private checkInstallStatus() {
    // Check if running in standalone mode
    this.isInstalled = window.matchMedia('(display-mode: standalone)').matches ||
                      (window.navigator as any).standalone === true;
    
    if (this.isInstalled) {
      document.body.classList.add('pwa-installed');
    }
  }

  // Notification Management
  async requestNotificationPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      console.log('Notifications not supported');
      return 'denied';
    }

    if (Notification.permission === 'default') {
      return await Notification.requestPermission();
    }

    return Notification.permission;
  }

  async subscribeToPushNotifications(): Promise<PushSubscription | null> {
    if (!this.registration) {
      console.log('Service Worker not registered');
      return null;
    }

    try {
      const permission = await this.requestNotificationPermission();
      if (permission !== 'granted') {
        console.log('Notification permission not granted');
        return null;
      }

      const subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(
          process.env.REACT_APP_VAPID_PUBLIC_KEY || ''
        ) as BufferSource
      });

      // Send subscription to server
      await this.sendSubscriptionToServer(subscription);
      
      return subscription;
    } catch (error) {
      console.error('Push subscription failed:', error);
      return null;
    }
  }

  // Send local notification
  async sendLocalNotification(payload: NotificationPayload) {
    const permission = await this.requestNotificationPermission();
    if (permission !== 'granted') return;

    if (this.registration) {
      // Use service worker notification for better control
      const options: NotificationOptions = {
        body: payload.body,
        icon: payload.icon || '/logo192.png',
        badge: payload.badge || '/logo192.png',
        tag: payload.tag,
        data: payload.data,
        requireInteraction: payload.requireInteraction || false
      };

      // Add vibrate and actions if supported
      if ('vibrate' in navigator) {
        (options as any).vibrate = [200, 100, 200];
      }
      
      if (payload.actions && 'actions' in Notification.prototype) {
        (options as any).actions = payload.actions;
      }

      await this.registration.showNotification(payload.title, options);
    } else {
      // Fallback to regular notification
      new Notification(payload.title, {
        body: payload.body,
        icon: payload.icon || '/logo192.png'
      });
    }
  }

  // Offline Data Management
  private db: IDBDatabase | null = null;

  async initIndexedDB(): Promise<IDBDatabase> {
    if (this.db) return this.db;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open('NiroGuardDB', 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create object stores for offline data
        if (!db.objectStoreNames.contains('pendingHealthReports')) {
          db.createObjectStore('pendingHealthReports', { keyPath: 'id' });
        }
        
        if (!db.objectStoreNames.contains('pendingWaterReports')) {
          db.createObjectStore('pendingWaterReports', { keyPath: 'id' });
        }
        
        if (!db.objectStoreNames.contains('pendingCaseUpdates')) {
          db.createObjectStore('pendingCaseUpdates', { keyPath: 'id' });
        }
        
        if (!db.objectStoreNames.contains('offlineCache')) {
          db.createObjectStore('offlineCache', { keyPath: 'key' });
        }
      };
    });
  }

  // Store data for offline sync
  async storeOfflineData(type: OfflineData['type'], data: any): Promise<string> {
    const db = await this.initIndexedDB();
    const id = `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const offlineData: OfflineData = {
      id,
      type,
      data,
      timestamp: Date.now(),
      retryCount: 0
    };

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([`pending${this.capitalizeFirst(type.replace('-', ''))}`], 'readwrite');
      const store = transaction.objectStore(`pending${this.capitalizeFirst(type.replace('-', ''))}`);
      const request = store.add(offlineData);

      request.onsuccess = () => {
        console.log('Data stored for offline sync:', id);
        this.requestBackgroundSync(type);
        resolve(id);
      };
      
      request.onerror = () => reject(request.error);
    });
  }

  // Request background sync
  private async requestBackgroundSync(type: OfflineData['type']) {
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      try {
        const registration = await navigator.serviceWorker.ready;
        // TypeScript doesn't include sync in the types yet, so we use any
        await (registration as any).sync.register(`${type}-sync`);
      } catch (error) {
        console.log('Background sync registration failed:', error);
      }
    }
  }

  // Network Status Management
  private isOnline = navigator.onLine;
  private onlineCallbacks: (() => void)[] = [];
  private offlineCallbacks: (() => void)[] = [];

  private setupOfflineSync() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.onlineCallbacks.forEach(callback => callback());
      this.syncPendingData();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.offlineCallbacks.forEach(callback => callback());
    });
  }

  onOnline(callback: () => void) {
    this.onlineCallbacks.push(callback);
  }

  onOffline(callback: () => void) {
    this.offlineCallbacks.push(callback);
  }

  getNetworkStatus() {
    return {
      isOnline: this.isOnline,
      connection: (navigator as any).connection || null
    };
  }

  // Cache Management
  async preloadCriticalData() {
    const criticalUrls = [
      '/api/emergency-contacts',
      '/api/health-tips',
      '/api/user-profile'
    ];

    if (this.registration) {
      this.registration.active?.postMessage({
        type: 'CACHE_URLS',
        payload: { urls: criticalUrls }
      });
    }
  }

  // Update Management
  private setupUpdateChecking() {
    // Check for updates every 30 minutes
    setInterval(() => {
      this.checkForUpdates();
    }, 30 * 60 * 1000);
  }

  async checkForUpdates() {
    if (this.registration) {
      await this.registration.update();
    }
  }

  private notifyUpdateAvailable() {
    this.sendLocalNotification({
      title: 'NiroGuard Update Available',
      body: 'A new version of NiroGuard is available. Refresh to update.',
      tag: 'app-update',
      requireInteraction: true,
      actions: [
        { action: 'update', title: 'Update Now', icon: '/icon-update.png' },
        { action: 'later', title: 'Later', icon: '/icon-later.png' }
      ]
    });
  }

  async applyUpdate() {
    if (this.registration && this.registration.waiting) {
      this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  }

  // Utility Methods
  private showInstallBanner() {
    // Create and show install banner UI
    const banner = document.createElement('div');
    banner.id = 'install-banner';
    banner.className = 'install-banner';
    banner.innerHTML = `
      <div class="install-banner-content">
        <span>Install NiroGuard for a better experience</span>
        <button id="install-button" class="btn-primary">Install</button>
        <button id="dismiss-banner" class="btn-secondary">×</button>
      </div>
    `;
    
    document.body.appendChild(banner);
    
    document.getElementById('install-button')?.addEventListener('click', () => {
      this.showInstallPrompt();
    });
    
    document.getElementById('dismiss-banner')?.addEventListener('click', () => {
      this.hideInstallBanner();
    });
  }

  private hideInstallBanner() {
    const banner = document.getElementById('install-banner');
    if (banner) {
      banner.remove();
    }
  }

  private async sendSubscriptionToServer(subscription: PushSubscription) {
    try {
      await fetch('/api/push-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription)
      });
    } catch (error) {
      console.error('Failed to send subscription to server:', error);
    }
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  private async syncPendingData() {
    // Trigger sync for all pending data types
    await this.requestBackgroundSync('health-report');
    await this.requestBackgroundSync('water-quality');
    await this.requestBackgroundSync('case-update');
  }

  private trackInstallEvent() {
    // Analytics tracking for app installation
    console.log('App installed successfully');
    // In real implementation, send to analytics service
  }

  private capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // Public getters
  get isAppInstalled(): boolean {
    return this.isInstalled;
  }

  get canInstall(): boolean {
    return this.installPrompt !== null;
  }

  get serviceWorkerRegistration(): ServiceWorkerRegistration | null {
    return this.registration;
  }
}

// Export singleton instance
export const pwaManager = new PWAManager();

// React Hook for PWA functionality
export function usePWA() {
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);
  const [canInstall, setCanInstall] = React.useState(false);
  const [isInstalled, setIsInstalled] = React.useState(pwaManager.isAppInstalled);
  const [updateAvailable, setUpdateAvailable] = React.useState(false);

  React.useEffect(() => {
    // Set up network status listeners
    pwaManager.onOnline(() => setIsOnline(true));
    pwaManager.onOffline(() => setIsOnline(false));

    // Check install status
    setCanInstall(pwaManager.canInstall);
    setIsInstalled(pwaManager.isAppInstalled);

    // Listen for beforeinstallprompt
    const handleBeforeInstallPrompt = () => {
      setCanInstall(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setCanInstall(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const installApp = async () => {
    const result = await pwaManager.showInstallPrompt();
    if (result) {
      setCanInstall(false);
    }
    return result;
  };

  const enableNotifications = async () => {
    return await pwaManager.subscribeToPushNotifications();
  };

  const storeOfflineData = async (type: OfflineData['type'], data: any) => {
    return await pwaManager.storeOfflineData(type, data);
  };

  const sendNotification = async (payload: NotificationPayload) => {
    return await pwaManager.sendLocalNotification(payload);
  };

  return {
    isOnline,
    canInstall,
    isInstalled,
    updateAvailable,
    installApp,
    enableNotifications,
    storeOfflineData,
    sendNotification,
    networkStatus: pwaManager.getNetworkStatus()
  };
}

// Import React for the hook
import React from 'react';