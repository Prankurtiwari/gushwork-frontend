import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Session {
  sessionId: string;
  credits: number;
}

export interface RollResult {
  symbols: string[];
  isWinner: boolean;
  reward: number;
  balance: number;
}

@Injectable({
  providedIn: 'root',
})
export class SlotMachineService {
  private baseUrl = 'http://localhost:8080/api/v1/slot-machine';

  constructor(private http: HttpClient) {}

  // POST /api/slot-machine/start to create a new session.
  startSession(): Observable<Session> {
    return this.http.post<Session>(`${this.baseUrl}/start`, {});
  }

  // POST /api/slot-machine/roll/{sessionId} to perform a roll.
  roll(sessionId: string): Observable<RollResult> {
    return this.http.get<RollResult>(`${this.baseUrl}/roll/${sessionId}`, {});
  }

  // POST /api/slot-machine/cash-out/{sessionId} to cash out.
  cashOut(sessionId: string): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/cash-out/${sessionId}`, {});
  }
}
