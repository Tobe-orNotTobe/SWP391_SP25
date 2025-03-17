// src/services/NotificationService.ts
import * as signalR from '@microsoft/signalr';
import { NotificationType } from '../interfaces/Notification';

class NotificationService {
  private connection: signalR.HubConnection | null = null;
  private connectionPromise: Promise<void> | null = null;
  private listeners: Array<(notification: NotificationType) => void> = [];
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectInterval: number = 5000; // 5 seconds
  private isConnecting: boolean = false;

  constructor() {
    this.setupConnection();
    
    // Listen for token changes or user login/logout
    window.addEventListener('tokenUpdated', () => {
      this.restartConnection();
    });
  }

  private setupConnection() {
    if (this.connection) {
      // Clean up existing connection
      this.connection.stop().catch(err => console.error('Error stopping connection:', err));
    }

    // Create the connection
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:7134/notificationHub', {
        accessTokenFactory: () => localStorage.getItem('token') || '',
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000, 15000, 30000]) // More sophisticated reconnection strategy
      .configureLogging(signalR.LogLevel.Information)
      .build();

    // Set up receive method
    this.connection.on('ReceiveNotification', (notification: NotificationType) => {
      console.log('Received notification:', notification);
      this.notifyListeners(notification);
    });

    // Set up connection events
    this.connection.onreconnecting(error => {
      console.log('Connection lost due to error. Reconnecting...', error);
      this.reconnectAttempts++;
    });

    this.connection.onreconnected(connectionId => {
      console.log('Connection reestablished. Connected with connectionId', connectionId);
      this.reconnectAttempts = 0;
    });

    this.connection.onclose(error => {
      console.log('Connection closed due to error:', error);
      
      // Try to manually reconnect if automatic reconnect fails
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        setTimeout(() => this.startConnection(), this.reconnectInterval);
      }
    });
  }

  public async startConnection(): Promise<void> {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('No token available, not connecting to notification hub');
      return Promise.resolve();
    }

    if (!this.connection) {
      this.setupConnection();
    }

    if (this.connection?.state === signalR.HubConnectionState.Connected) {
      return Promise.resolve();
    }

    if (this.isConnecting) {
      return this.connectionPromise || Promise.resolve();
    }

    this.isConnecting = true;

    this.connectionPromise = this.connection!.start()
      .then(() => {
        console.log('SignalR Connected successfully.');
        this.reconnectAttempts = 0;
        this.isConnecting = false;
      })
      .catch(err => {
        console.error('Error while establishing connection:', err);
        this.isConnecting = false;
        this.connectionPromise = null;
        
        // Try to reconnect after a delay
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          setTimeout(() => this.startConnection(), this.reconnectInterval);
        }
        
        throw err;
      });

    return this.connectionPromise;
  }

  public stopConnection(): Promise<void> {
    if (this.connection?.state === signalR.HubConnectionState.Connected ||
        this.connection?.state === signalR.HubConnectionState.Connecting ||
        this.connection?.state === signalR.HubConnectionState.Reconnecting) {
      this.connectionPromise = null;
      this.isConnecting = false;
      return this.connection.stop();
    }
    return Promise.resolve();
  }

  public restartConnection(): void {
    this.stopConnection()
      .then(() => {
        this.setupConnection();
        return this.startConnection();
      })
      .catch(err => console.error('Error restarting connection:', err));
  }

  public addListener(callback: (notification: NotificationType) => void, p0?: ((notification: NotificationType) => Promise<void>)[]): () => void {
    this.listeners.push(callback);
    
    // Return function to remove this listener
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  private notifyListeners(notification: NotificationType): void {
    this.listeners.forEach(listener => listener(notification));
  }

  public getConnectionState(): signalR.HubConnectionState | null {
    return this.connection?.state ?? null;
  }
}

// Create singleton instance
const notificationService = new NotificationService();
export default notificationService;