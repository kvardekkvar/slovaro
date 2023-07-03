import {Component} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Source} from "./source";

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
}
