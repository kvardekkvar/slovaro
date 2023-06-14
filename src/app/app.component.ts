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
  sources: any[] = [];
  activeSource: Source = new Source(-1, -1, "ololo");
  words: any[] = [];
  serverUrl = 'http://178.209.46.147:8080/slovaro';

  constructor(private http: HttpClient) {
    this.http = http;
    this.getSources();
  }
  getSources() {
    return this.http.get(this.serverUrl + "/sources").subscribe((data: any) => this.sources = data)
  }

  setActiveSource(id: number) {
    for (let source of this.sources) {
      if (source.id == id) {
        this.activeSource = source;
        document
          .querySelectorAll(".active-source")
          .forEach(x => x.classList.remove("active-source"));
        document
          .querySelectorAll('.source[data-sourceid="' + source.id + '"]')
          .forEach(x => x.classList.add("active-source"));
        this.getWords(source.id);
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
}
