import { AdminNewComponent } from './../admin/admin-new/admin-new.component';
import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PreventChangesGuard implements CanDeactivate<AdminNewComponent> {
  canDeactivate(component: AdminNewComponent): Observable<boolean> | Promise<boolean> | boolean {
    if (component.f.dirty) {
      return confirm('Are you sure you want to leave this page? All unsaved chaneges will be lost');
    }

    return true;
  }
}
