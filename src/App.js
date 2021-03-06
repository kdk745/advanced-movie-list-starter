import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import MovieList from './components/MovieList';
import SearchBar from './components/SearchBar';
import AddedMovies from './components/AddedMovies';
import {
  Grid,
  Row,
  Col,
  PageHeader
} from 'react-bootstrap';

class App extends Component {
  constructor() {
    super();

    this.state = {
      searchText: '',
      movies: [],
      addedMovies: []
    };
  }

  updateAdded(data) {
    this.setState({
      addedMovies: data
    });
  }

  update(data) {
    this.setState({
      movies: data,
    });
  }

  componentDidMount() {
    axios.get('/addedMovies')
      .then(resp => {
        this.setState({
          searchText: this.state.searchText,
          addedMovies: resp.data
        });
      })
      .catch(err => console.log(`Error! ${err}`));
  }

  handleAddMovie(attributes) {
    const newMovie = {
      title: attributes.title,
      posterpath: attributes.poster_path,
      overview: attributes.overview
    };
    const newMovies = this.state.movies.filter(movie => movie.id !== attributes.id);
    axios.post('/addedMovies', newMovie)
      .then(resp => {
        this.setState({
          movies: newMovies,
          addedMovies: [...this.state.addedMovies, resp.data]
        });
      });
  }

  handleRemoveMovie(id) {
    axios.delete(`/addedMovies/${id}`)
      .then(resp => {
        const newMovies = this.state.addedMovies.filter(movie => movie._id !== id);
        this.setState({
          addedMovies: newMovies
        });
      })
      .catch(err => console.log(`ERROR! ${err}`));
  }

  handleSearchBarChange(text) {
    axios.get(`https://api.themoviedb.org/3/search/movie?api_key=fde54a01d27516539d182393c4aab6d5&language=en-US&query=${text}&page=1&include_adult=false`)
      .then(
        resp => this.update(resp.data.results, text)
      );
  }

  render() {
    return (
      <div className="container main">
        <PageHeader className="header">Welcome</PageHeader>
        <SearchBar
          className="search-bar"
          onButtonClick={this.handleSearchBarChange.bind(this)}
        />
        <Grid>
          <Row>
            <Col md={6} mdPush={6}>
              <PageHeader><small>Added Movies</small></PageHeader>
              <AddedMovies
                movies={this.state.addedMovies}
                RemoveMovie={this.handleRemoveMovie.bind(this)}
              />
            </Col>
            <Col md={6} mdPull={6}>
              <PageHeader><small>Search Results</small></PageHeader>
              <MovieList
                movies={this.state.movies}
                AddMovie={this.handleAddMovie.bind(this)}
              />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}
export default App;
