export interface WsBotSendMessage {
  title?: string;
  message: string;
  controllerid: string;
}

export interface WsBotConnectionEvent {
  controllerid: string;
  clientid: string;
}

export interface WsBotSendScreensEvent {
  controllerid: string;
  screens: {
    id: number;
    resolution: [number, number];
    frequency: number;
    isprimary: boolean;
  }[];
}
