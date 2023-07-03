export class EditModal {

 private type! : string;
 private element!: HTMLElement;

 public getType(){
 return this.type;
 }
 public getElement(){
 return this.element;
 }
 public setType(type : string){
 this.type = type
 }
 public setElement(element : HTMLElement){
 this.element = element;
 }
}
