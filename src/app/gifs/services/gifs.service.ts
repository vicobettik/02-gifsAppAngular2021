import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchGifsResponse, Gif } from '../interfaces/gifs.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private _historial: string[] = [];
  public resultados: Gif[] = [];
  private apiKey: string = 'Odlm70jt3CcrWhTplchwKFSPNS80Vo7b';
  private servicioURL: string = 'https://api.giphy.com/v1/gifs';

  get historial(){
    return [...this._historial];
  }

  constructor(private http: HttpClient){
    this._historial = JSON.parse(localStorage.getItem('historial')!) || [];
    this.resultados = JSON.parse(localStorage.getItem('ultimosResultados')!) || [];
  }

  buscarGifs(query: string){
    
    query = query.toLocaleLowerCase();

    if (!this._historial.includes(query)) {

      this._historial.unshift(query);
      this._historial = this._historial.splice(0,9);

      localStorage.setItem('historial', JSON.stringify(this.historial))
      
    }

    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('limit', '10')
      .set('q', query);

    this.http.get<SearchGifsResponse>(`${this.servicioURL}/search`,{params: params})
      .subscribe( (resp) => {
        console.log(resp.data);
        this.resultados = resp.data;
        localStorage.setItem('ultimosResultados', JSON.stringify(this.resultados))
      });

  }
  
}
