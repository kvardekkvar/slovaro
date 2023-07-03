import {Component} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Source} from "./source";
import {EditModal} from "./edit-modal";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  {
  title = 'slovaro';
  sources: Source[] = [];
  activeSource: Source = new Source();
  words: any[] = [];
  serverUrl = 'http://178.209.46.147:8080/slovaro';
  modalData =  new EditModal();

  constructor(private http: HttpClient) {
    this.http = http;
    this.getSources();
  }
  getSources() {
    return this.http.get<Source[]>(this.serverUrl + "/sources").subscribe(
    (data: Source[]) =>
    this.sources = data.map(x=> Object.assign(new Source(), x))
    )
  }

  setActiveSource(id: number) {
    for (let source of this.sources) {
      if (source.getId() == id) {
        this.activeSource = source;
        document
          .querySelectorAll(".active-source")
          .forEach(x => x.classList.remove("active-source"));
        document
          .querySelectorAll('.source[data-sourceid="' + source.getId() + '"]')
          .forEach(x => x.classList.add("active-source"));
        this.getWords(source.getId());
        break;
      }

    }
  }

  getWords(sourceId: number) {
    let query: URL = new URL(this.serverUrl + "/words");
    query.searchParams.append("sourceId", sourceId.toString());
    let requestURL = query.toString();
    return this.http.get(requestURL).subscribe((data: any) => this.words = data)

  }

  addSource(){
    let source = (document.querySelectorAll('.input-source')[0] as HTMLInputElement).value;

    let query: URL = new URL(this.serverUrl + "/sources");
    let requestURL = query.toString();

    const body = {userId: 1, name: source};
    return this.http.post(requestURL, body).subscribe(
      (data: any) => {
          console.log(data);
          this.getSources();
          },
      (error) => console.log(error)
    );

  }

    addWord(){
      let word = (document.querySelectorAll('.input-word')[0] as HTMLInputElement).value;

      let query: URL = new URL(this.serverUrl + "/words");
      let requestURL = query.toString();

      const body = {userId: 1, content: word, sourceId: this.activeSource.getId()};
      return this.http.post(requestURL, body).subscribe(
        (data: any) => {
            console.log(data);
            this.getWords(this.activeSource.getId());
          },
        (error) => console.log(error)
        );

    }

    showModal(mode: string, event: any){
        console.log('tight click');
        let target = event.target as HTMLElement;
        let modal;

        modal = document.querySelectorAll('#edit-modal')[0] as HTMLElement;


        this.modalData.setElement(target);
        this.modalData.setType(mode);

          if(modal){
                modal.classList.remove('hidden');

            let rect = target.getBoundingClientRect();

            modal.style.position='absolute';
            modal.style.left = rect.left + 'px';
            modal.style.top = rect.top + 'px';

              let inputField = document.querySelectorAll('#edit-modal input')[0] as HTMLInputElement;
              inputField.style.width = target.offsetWidth + 'px';
              mode === 'source'? modal.classList.add('modal-for-source') : modal.classList.remove('modal-for-source');

              inputField.value = target.innerHTML;
              document.querySelectorAll('.modal-root')[0].classList.add('visible');

        }
    }

    closeModal(){
        document.querySelectorAll('.modal-root')[0].classList.remove('visible');
        document.querySelectorAll('#edit-modal')[0].classList.toggle('hidden');
      }

    editEntry(){

    if (this.modalData.getType() === 'source'){
      let entry = (document.querySelectorAll('#edit-modal input')[0] as HTMLInputElement).value;

      const body = {
        userId: 1,
        name: entry,
        id: this.modalData.getElement().getAttribute('data-sourceid')
        };
       this.http.put(this.serverUrl + "/sources", body).subscribe(
        (data: any) => {
            console.log(data);
            this.getSources();
          },
        (error) => console.log(error)
        );

      }

    if (this.modalData.getType() === 'word'){
      let entry = (document.querySelectorAll('#edit-modal input')[0] as HTMLInputElement).value;

      const body = {
        userId: 1,
        content: entry,
        id: this.modalData.getElement().getAttribute('data-wordid'),
        sourceId: this.activeSource.getId()
        };
       this.http.put(this.serverUrl + "/words", body).subscribe(
        (data: any) => {
            console.log(data);
            this.getSources();
          },
        (error) => console.log(error)
        );
      }
    }

    deleteEntry(){

    if (this.modalData.getType() === 'source'){
      let sourceId = this.modalData.getElement().getAttribute('data-sourceid');

    this.http.delete(this.serverUrl + "/sources/" + sourceId).subscribe((data: any) =>
      {
      console.log(data);
      this.getSources();
      }
    );
      this.closeModal();

      }

    if (this.modalData.getType() === 'word'){
      let wordId = this.modalData.getElement().getAttribute('data-wordid');

    this.http.delete(this.serverUrl + "/words/" + wordId).subscribe((data: any) =>
      {
      console.log(data);
      this.getWords(this.activeSource.getId());
      }
    );
      this.closeModal();

      }


      return;
    }
}
