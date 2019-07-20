
import React from 'react';
import './todo.css';
import { connect } from 'react-redux';
import { todoService } from '../services/todo';
import { addItem, finishItem, cancelItem, addDetail, showDetail, closeDetail, clearAll, loadList } from '../actions/todoActions'

class Todo extends React.Component {
    constructor() {
        super();
        this.title = React.createRef();
        this.detail = React.createRef();
    }
    componentDidMount() {
        todoService.getItems(this.props.loadList);
    }
    todoText(id, text, done, detail) {
        const key = id + "1";
        let detailObj = { title: text, detail: detail };
        if (done) {
            return <li key={key} onClick={() => this.props.showDetail(detailObj)} className="text cross-out">{text}</li>
        } else {
            return <li key={key} onClick={() => this.props.showDetail(detailObj)} className="text">{text} {done}</li>
        }
    }
    doneButton(id, done) {
        const key = id + "2";
        if (done) {
            return <li key={key} className="done" onClick={() => this.props.finishItem(id)}>Not Done</li>
        } else {
            return <li key={key} className="done" onClick={() => this.props.finishItem(id)}>Done</li>
        }
    }
    produceTodoListView() {
        let list = Object.values(this.props.list).map((todo) =>
            <ul className="horizontal" key={todo.id + "list"}>
                {this.todoText(todo.id, todo.text, todo.done, todo.detail)}
                {this.doneButton(todo.id, todo.done)}
                <li key={todo.id} className="cancel" onClick={() => this.props.cancelItem(todo.id)}>Cancel</li>
            </ul>
        );
        let currList = (
            <div className="3">
                <h3>All todo list</h3>
            </div>
        )
        let clearAll = (
            <div className="container center">
                <button className="button-clear" onClick={() => this.props.clearAll()}>Clear All</button>
            </div>
        )
        return (
            <div>
                {list.length > 0 ? currList : null}
                <br></br>
                <ul>{list}</ul>
                <br></br>
                {list.length > 0 ? clearAll : null}
            </div>
        )
    }
    produceDetailView() {
        return (
            <div className="container center">
                <h3>{this.props.ui.title}</h3>
                <h5>{this.props.ui.detail}</h5>
                <input type="button" onClick={() => this.props.closeDetail()} value="Close" className="button button-clear"></input>
            </div>
        )
    }
    produceAddTodoItemView() {
        return (
            <form>
                <input ref={this.title} type="text" className="text-line" placeholder="Any todo item?"></input>
                <br></br>
                <textarea ref={this.detail} className="text-line text-small-font" rows="5" cols="30" placeholder="Any details?"></textarea>
                <br></br>
                <input type="button" value="Add" className="button button-add" onClick={this.submit}></input>
            </form>
        )
    }
    submit = () => {
        if (this.title.current.value === "") {
            alert("Enter something")
            return;
        }
        let showItem = (data) => {
            if (data["todo"] !== null || data["todo"] !== undefined)
                this.props.loadList(data);
        }
        todoService.addItem(this.title.current.value, this.detail.current.value, showItem);
        this.title.current.value = "";
        this.detail.current.value = "";
    }
    render() {
        const list = this.produceTodoListView();
        const detailedView = this.produceDetailView();
        return (
            <div className="container">
                <div className="center">
                    <h2>Todo List</h2>
                </div>
                <div className="center">
                    {this.produceAddTodoItemView()}
                </div>
                {this.props.ui.showDetail ? detailedView : list}
            </div>
        );
    }
}

const mapStateToProps = (state) => { return { list: state.list, ui: state.ui } };
const mapDispatchToProps = { addItem, finishItem, cancelItem, addDetail, showDetail, closeDetail, clearAll, loadList };
export default connect(mapStateToProps, mapDispatchToProps)(Todo);