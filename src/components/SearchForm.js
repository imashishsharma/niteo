import React from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3000/read-web';

export default class SearchForm extends React.Component {
    state = {
        searchString: '',
        errorMessage: '',
        searchResults: '',
        count: 0
    } 
    handleOnChange = (e) => {
        const searchString = e.target.value;
        this.setState(() => ({ searchString }));
    }
    handleOnSubmit = (e) => {
        e.preventDefault();
        const encodedSearchString = encodeURIComponent(this.state.searchString);
        axios.get(`${API_URL}/${encodedSearchString}`)
        .then((response) => {
            this.setState(() => ({ searchResults: response.data[0], count: response.data[1] }));            
        })
        .catch((error) => {
          this.setState(() => ({ errorMessage: 'Some error while fetching' }));
          console.error(error);
        });
    }
    render() {
        return (
            <div>
                <div>
                    <form onSubmit={this.handleOnSubmit} className="align-form">
                        <input 
                            type="text" 
                            placeholder="Enter search keyword"
                            value={this.state.searchString}
                            onChange={this.handleOnChange}
                            required
                        />
                        <button>Search</button>
                    </form>
                </div>
                <div>
                    {!this.state.errorMessage ? <h3>Results: </h3> : <h3>Error:</h3>}
                    {!this.state.errorMessage && <p>No of occurences of {this.state.searchString} in result is {this.state.count}</p>}
                    {!this.state.errorMessage ? <p dangerouslySetInnerHTML={{ __html: this.state.searchResults }}></p> : this.state.errorMessage}
                </div>                
            </div>
        )
    }
}
