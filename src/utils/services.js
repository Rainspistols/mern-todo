export default class MongoService {
  _apiBase = 'http://localhost:9200';

  getResource = (url) => {
    return fetch(`${this._apiBase}${url}`).then((res) => {
      if (!res.ok) {
        throw new Error(`Could not fetch ${url}` + `, received ${res.status}`);
      }
      return res.json();
    });
  };

  postResource = (url, body) => {
    return fetch(`${this._apiBase}${url}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }).then((res) => res.json());
  };

  deleteResource = (url) => {
    return fetch(`${this._apiBase}${url}`, {
      method: 'DELETE',
    }).then((res) => res.json());
  };

  putResource = (url, body) => {
    return fetch(`${this._apiBase}${url}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }).then((data) => data.json());
  };

  getAllTodos = () =>
    this.getResource('/todos/_search?size=100&filter_path=hits.hits._source,hits.hits._id');
  getTodo = (id) => this.getResource(`/todos/${id}`);
  postTodo = (body) => this.postResource('/todos/_doc/', body);
  deleteTodo = (id) => this.deleteResource(`/todos/_doc/${id}`);
  editTodo = (id, body) => this.putResource(`/todos/_doc/${id}`, body);
  searchTodos = (name) => this.getResource(`/todos/_search?q=name:${name}`);
}
