export interface Room {
  id: number;
  name: string;
}

export interface Message {
  id?: number;
  sender: string;
  content: string;
  timestamp: string;
  roomId: number;
} 