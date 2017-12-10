import { Component, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import { ActionResult } from './models/ro/iresource';
import { ActionInvocationService } from './services/action-invocation.service';
import { ComponentFactoryService } from './services/component-factory.service';
import { ListComponent } from './list/list.component';
import { DialogComponent } from './dialog/dialog.component';
import { ComponentRef } from '@angular/core/src/linker/component_factory';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  @ViewChild('desktop', {read: ViewContainerRef}) private _desktop: ViewContainerRef;

  constructor(private invoker: ActionInvocationService,
            private componentFactory: ComponentFactoryService) {
    invoker.actionInvoked.subscribe(data => {
       this.componentFactory.createComponent(this._desktop, ListComponent, {'actionResource': data});
    });

    // action params needed
    invoker.actionParamsNeeded.subscribe(args => {
      if (!args.Canvas) {
        args.Canvas = this._desktop;
      }

      const dialog =  this.componentFactory.createComponent(
        args.Canvas,
        DialogComponent, {'args': args.ActionDescriptor}) as ComponentRef<DialogComponent>;

         dialog.instance.onParamtersCollected.subscribe(data => {
           this.invoker.invokeAction(args.ObjectAction, args.ActionDescriptor, null, data);
         });
    });
 }
}
