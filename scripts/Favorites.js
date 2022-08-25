import { GitHubUser } from "./GitHubUser.js";

// classe que vai fazer a lógica e estrutura dos dados 
export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root)
    this.load()

    // GitHubUser.search('lfoalves').then(user => console.log(user))
  };

  load() {
    this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || [];
  };

  save() {
    localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
  };
  
  async add(username) {
    try {

      const userExists = this.entries.find(entry => entry.login === username);

      if (userExists) {
        throw new Error('Favorito já cadastrado');
      };

      const user = await GitHubUser.search(username)

      if (user.login === undefined) {
        throw new Error('Usuário não encontrado');
      }

      this.entries = [user, ...this.entries];
      this.update();
      this.save();

    } catch (err) {
      alert(err.message)
    }
  };

  delete(user) {
    const filteredEntries = this.entries
    .filter((entry) => {
      return entry.login !== user.login
    });
    
    this.entries = filteredEntries;
    this.update();
    this.save();
  };
};

// classe para criar e visualizar os eventos HTML
export class FavoritesView extends Favorites {
  constructor(root) {
    super(root)

    this.tbody = this.root.querySelector('table tbody')  

    this.update();
    this.onadd();
  };

  onadd() {
    const addButton = this.root.querySelector('.search button');
    addButton.onclick = () => {
      const { value } = this.root.querySelector('.search input');
      this.add(value);
    }
  };

  update() {
    this.removeAllTr();    

    this.entries.forEach((user) => {
      const row = this.createRow()

      row.querySelector('.user img').src = `https://www.github.com/${user.login}.png`;
      row.querySelector('.user img').alt = `Imagem de ${user.name}`;
      row.querySelector('.user a').href = `https://www.github.com/${user.login}`;
      row.querySelector('.user p').textContent = user.name;
      row.querySelector('.user span').textContent = user.login;
      row.querySelector('.repositories').textContent = user.public_repos;
      row.querySelector('.followers').textContent = user.followers;

      row.querySelector('.remove').onclick = () => {
        const isOk = confirm('Tem certeza que deseja deletar essa linha?')
        if (isOk) {
          this.delete(user)
        }
      }

      this.tbody.append(row)
    });

  };

  createRow() {
    const tr = document.createElement('tr')
    tr.innerHTML = `
          <td class="user">
            <img src="https://www.github.com/maykbrito.png" alt="" />
            <a href="https://www.github.com/maykbrito" target="_blank">
              <p>Mayk Brito</p>
              <span>@maykbrito</span>
            </a>
          </td>
          <td class="repositories">
            150
          </td>
          <td class="followers">
            9500
          </td>
          <td>
            <button class="remove" title='Clique para remover'>
              &times;
            </button>
          </td>
    `
    return tr;
  };

  removeAllTr() {
    this.tbody.querySelectorAll('tr').forEach((tr) => tr.remove())
  };

};