import { Injectable } from '@nestjs/common';
import { AccessToken, RoomServiceClient } from 'livekit-server-sdk';

@Injectable()
export class LiveKitService {
  private readonly apiKey: string;
  private readonly apiSecret: string;
  private readonly wsUrl: string;

  constructor() {
    this.apiKey = process.env.LIVEKIT_API_KEY || 'devkey';
    this.apiSecret = process.env.LIVEKIT_API_SECRET || 'secret';
    this.wsUrl = process.env.LIVEKIT_WS_URL || 'ws://localhost:7880';
  }

  /**
   * Generate a join token for a participant entering a room.
   * @param roomName  The unique room identifier (e.g. class roomId)
   * @param identity  Unique identity for the participant (e.g. user email)
   * @param name      Display name shown inside the call
   * @param canPublish Whether participant can publish video/audio (false = student viewer)
   */
  async generateToken(
    roomName: string,
    identity: string,
    name: string,
    canPublish = true,
  ): Promise<{ token: string; wsUrl: string }> {
    const at = new AccessToken(this.apiKey, this.apiSecret, {
      identity,
      name,
      ttl: '4h',
    });

    at.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish,
      canSubscribe: true,
      canPublishData: true,
    });

    const token = await at.toJwt();
    return { token, wsUrl: this.wsUrl };
  }
}
