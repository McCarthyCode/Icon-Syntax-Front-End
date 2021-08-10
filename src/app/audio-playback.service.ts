import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AudioPlaybackService {
  constructor(private _http: HttpClient) {}

  play(id: string, $event): Promise<void> {
    return this._http
      .get(environment.apiBase + `/audio/${id}.mp3`)
      .toPromise()
      .then((data: { id: string; mp3: string }) => {
        const sound = new Audio(`data:audio/mp3;base64,${data.mp3}`);
        sound.addEventListener('ended', () => {
          $event.target.name = 'volume-off';
        });

        return sound.play();
      });
  }
}
