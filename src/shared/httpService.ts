import { from, Observable } from "rxjs";

enum HttpStatusCode {
  NoContent = 204,
}

class HttpService {

  public expireHandler: () => void;

  constructor() {
    this.expireHandler = () => void (0);
  }

  public async getJsonAsync<T>(url: string): Promise<T> {
    const request = new Request(url, {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      method: "GET",
    });
    return this.fetchWithOnResponse(request);
  }

  public async postJsonAndReturnAsync<T>(url: string, payload: any): Promise<T> {
    const request = new Request(url, {
      body: JSON.stringify(payload),
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });
    return await this.fetchWithOnResponse(request);
  }

  public async postFormAndReturnJsonAsync<T>(url: string, form: FormData): Promise<T> {
    const request = new Request(url, {
      body: form,
      credentials: "include",
      method: "POST",
    });
    return this.fetchWithOnResponse(request);
  }

  public async deleteJsonAsync(url: string): Promise<any> {
    const request = new Request(url, {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    return this.fetchWithOnResponse(request);
  }

  public async postJsonAsync(url: string, payload: any): Promise<any> {
    const request = new Request(url, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return this.fetchWithOnResponse(request);
  }

  public async postFormAsync(url: string, form: FormData): Promise<any> {
    const request = new Request(url, {
      method: "POST",
      credentials: "include",
      body: form,
    });
    return this.fetchWithOnResponse(request);
  }

  public getJsonObservable<T>(url: string): Observable<T> {
    return from(this.getJsonAsync<T>(url));
  }

  public deleteJsonObservable(url: string): Observable<{}> {
    return from(this.deleteJsonAsync(url));
  }

  public postJsonAndReturnObservable<T>(url: string, payload: any): Observable<T> {
    return from(this.postJsonAndReturnAsync<T>(url, payload));
  }

  public postJsonObservable(url: string, payload = {}): Observable<{}> {
    return from(this.postJsonAsync(url, payload));
  }

  public postFormObservable(url: string, form: FormData): Observable<{}> {
    return from(this.postFormAsync(url, form));
  }

  public postFormAndReturnJsonObservable<T>(url: string, form: FormData): Observable<T> {
    return from(this.postFormAndReturnJsonAsync<T>(url, form));
  }

  public async downloadFile(url: string): Promise<any> {
    const result = await fetch(url);
    return this.readFile(result);
  }

  private async readFile(response: Response): Promise<any> {
    const fileName = response.headers
      .get("content-disposition")
      .split("filename=")[1]
      .split(";")[0]
      .replace(/['"]+/g, "");
    const blob = await response.blob();
    return this.blobToFile(blob, fileName);
  }

  private blobToFile = (theBlob: Blob, fileName: string): File => {
    return new File([theBlob], fileName);
  }

  private async fetchWithOnResponse(request: Request) {
    let response: Response;
    try {
      response = await fetch(request);
    } catch (e) {

      if (this.expireHandler) {
        this.expireHandler();
      }

      throw new Error("Unable to establish connection with the server");
    }

    if (!response.ok) {
      if (this.isJsonResponse(response)) {
        const apiError = await response.json();
        throw new Error(apiError.message);
      } else { throw new Error("Unexpected server response."); }
    }

    if (response.status === HttpStatusCode.NoContent) { return null; }

    if (this.isJsonResponse(response)) { return response.json(); }

    if (this.isFileResponse(response)) { return this.readFile(response); }

    return true;
  }

  private isJsonResponse = (response: Response) => {
    const contentType = response.headers.get("content-type");
    return contentType && contentType.indexOf("application/json") !== -1;
  }

  private isFileResponse = (response: Response) =>
    response.headers.get("content-disposition") && response.headers.get("content-disposition").length > 0
}

const http = new HttpService();
export default http;
