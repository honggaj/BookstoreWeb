// services/crisp.service.ts
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CrispService {
  private loaded = false;

  load() {
    if (this.loaded) return;
    (window as any).$crisp = [];
    (window as any).CRISP_WEBSITE_ID = "3cfe2580-1f37-4936-bec7-0d06951d72af";

    const s = document.createElement("script");
    s.src = "https://client.crisp.chat/l.js";
    s.async = true;
    document.head.appendChild(s);

    this.loaded = true;
  }
}
