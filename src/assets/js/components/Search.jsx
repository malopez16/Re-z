import React from 'react';
import { hot } from 'react-hot-loader';

function SearchBar(props) {
  return (
    <form onSubmit={props.handleSubmit}>
    <label>
      <input type="text" onChange={props.handleChange} />
    </label>
      <input type="submit" value="Buscar" />
    </form>
  );
}

class SearchApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search_query: "",
      first: true,
      recipes: [],
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }


  handleSubmit(event) {
    const body_query = "search_query=" + this.state.search_query

    fetch('/api/search', {
      headers: { 'Content-type': 'application/x-www-form-urlencoded' },
      method: 'POST',
      body: body_query,
    })
      .then(response => response.json())
      .then((data) => {
        const recipes = [];
        console.log(data.data)
        if (data.data.length != 0){
          data.data.forEach((recipe_data) => {
            const recipe = {}
            recipe.name = recipe_data.attributes.name
            recipe.calories = recipe_data.attributes.calories
            recipe.description = recipe_data.attributes.description
            recipe.id = recipe_data.id
            recipe.link = recipe_data.links.self
            recipes.push(recipe)
          })
        }
        this.setState({recipes: recipes, first: false})
      })
    event.preventDefault();
  }

  handleChange(event) {
    this.setState({search_query: event.target.value})
  }

  renderSearchBar (){
    return (<SearchBar  handleSubmit={this.handleSubmit} handleChange = {this.handleChange}/>)
  }

  renderTable (){
    if( !this.state.first && this.state.recipes.length == 0){
      return (
        <p> No se encontraron recetas con estos ingredientes :(</p>
      )
    }
    if (!this.state.first) {
      return (
        <table id = "generic-list">
          <thead>
              <tr>
                <th>Nombre</th>
                <th>Calorías</th>
                <th>Descripción</th>
              </tr>
          </thead>
          <tbody>
            {this.state.recipes.map(recipe => (
                <tr key={recipe.id}>
                  <td> <a href={recipe.link} > {recipe.name} </a> </td>
                  <td>  {recipe.calories} </td>
                  <td>  {recipe.description} </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      )
    }
  }

  render (){
      return(
        <div>
          {this.renderSearchBar()}
          {this.renderTable()}
        </div>
      );
    }
}



export default hot(module)(SearchApp);
