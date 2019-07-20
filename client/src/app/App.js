import React from 'react';
import { connect } from 'react-redux';
import Todo from './components/todo';

class App extends React.Component {
    render() {
        return (
            <div className="jumbotron">
                <div className="container">
                    <div>
                        <Todo />
                    </div>
                </div>
            </div>
        );
    }
}

export default connect()(App);