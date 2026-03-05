import { Hands, Results, HAND_CONNECTIONS } from '@mediapipe/hands';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import { Camera } from '@mediapipe/camera_utils';

export type Gesture = 'rock' | 'paper' | 'scissors' | 'none';

export class HandTracker {
  private hands: Hands;
  private camera: Camera | null = null;
  private onResultsCallback: (gesture: Gesture, results: Results) => void;

  constructor(videoElement: HTMLVideoElement, onResults: (gesture: Gesture, results: Results) => void) {
    this.onResultsCallback = onResults;
    this.hands = new Hands({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
      },
    });

    this.hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    this.hands.onResults((results) => {
      const gesture = this.detectGesture(results);
      this.onResultsCallback(gesture, results);
    });

    this.camera = new Camera(videoElement, {
      onFrame: async () => {
        await this.hands.send({ image: videoElement });
      },
    });
  }

  public async start() {
    await this.camera?.start();
  }

  public async stop() {
    await this.camera?.stop();
    await this.hands.close();
  }

  private detectGesture(results: Results): Gesture {
    if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
      return 'none';
    }

    const landmarks = results.multiHandLandmarks[0];
    
    const getDist = (p1: any, p2: any) => {
      return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
    };

    const wrist = landmarks[0];
    
    // Check extension for 4 fingers (Index, Middle, Ring, Pinky)
    // We compare tip distance from wrist vs MCP (base) distance from wrist
    const indexExtended = getDist(wrist, landmarks[8]) > getDist(wrist, landmarks[6]);
    const middleExtended = getDist(wrist, landmarks[12]) > getDist(wrist, landmarks[10]);
    const ringExtended = getDist(wrist, landmarks[16]) > getDist(wrist, landmarks[14]);
    const pinkyExtended = getDist(wrist, landmarks[20]) > getDist(wrist, landmarks[18]);

    // Thumb is tricky, check if it's far from the index base
    const thumbExtended = getDist(landmarks[4], landmarks[9]) > getDist(landmarks[3], landmarks[9]);

    const extendedCount = [indexExtended, middleExtended, ringExtended, pinkyExtended].filter(Boolean).length;

    // Paper: 3 or 4 fingers extended
    if (extendedCount >= 3) {
      return 'paper';
    }

    // Scissors: Exactly 2 fingers extended (usually index and middle)
    if (extendedCount === 2) {
      return 'scissors';
    }

    // Rock: 0 or 1 finger extended
    if (extendedCount <= 1) {
      return 'rock';
    }

    return 'none';
  }

  public static draw(ctx: CanvasRenderingContext2D, results: Results) {
    ctx.save();
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    if (results.multiHandLandmarks) {
      for (const landmarks of results.multiHandLandmarks) {
        drawConnectors(ctx, landmarks, HAND_CONNECTIONS, {
          color: '#10b981',
          lineWidth: 5,
        });
        drawLandmarks(ctx, landmarks, {
          color: '#ffffff',
          lineWidth: 2,
          radius: 4,
        });
      }
    }
    ctx.restore();
  }
}
