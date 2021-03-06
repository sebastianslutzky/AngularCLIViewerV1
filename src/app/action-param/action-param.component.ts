import { Component, OnInit, Input, ViewContainerRef, ViewChild } from '@angular/core';
import { TextParamComponent } from '../text-param/text-param.component';
import { ComponentFactoryService } from '../services/component-factory.service';
import { MetamodelService } from '../services/metamodel.service';
import { ResourceLink, ParamDescription,  DomainType } from '../models/ro/iresource';

@Component({
  selector: 'app-action-param',
  templateUrl: './action-param.component.html',
  styleUrls: ['./action-param.component.css']
})
export class ActionParamComponent implements OnInit {

  @Input()
  Parameter: ResourceLink;
  @Input()
  Context: any;
  @Input()
  Key: string;

  descriptor: ParamDescription;

 get friendlyName(): string {
  return this.descriptor.extensions.friendlyName;
 }

  constructor(private componentFactory: ComponentFactoryService, private container: ViewContainerRef,
     private metamodel: MetamodelService) { }

  ngOnInit() {
    this.metamodel.loadLink(ParamDescription, this.Parameter).subscribe(paramDescr => {
        this.descriptor = paramDescr;
        this.metamodel.loadReturnType(DomainType, paramDescr).subscribe(paramType => {
          const view = this.renderInput(paramType.canonicalName);
          this.componentFactory.createComponent(this.container, view,
            {'args': paramDescr,
            'ctx': this.Context,
          'key': this.Key});
        });
      });
  }

  renderInput(propertyType: string): any {
      switch (propertyType) {
        case 'java.lang.String': {
          return TextParamComponent;
        }
        default: {
          console.warn('don\'t know how to render columns of type: ' + propertyType + '. Viewing as string');
          return TextParamComponent;
        }
      }
  }
}

