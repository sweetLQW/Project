//react引入文件
import React from "react";
import ReactDom from "react-dom";
class StudentsList extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            checked:"true"
        }
    }
    change(){
        this.setState({
            checked:!this.state.checked
        })
    }
    render(){
        return(
            <div>
                <h1>你选择的是：{this.state.checked?"是":"否"}</h1>
                <input type="radio" checked={this.state.checked} onChange={this.change.bind(this)} />
            </div>
        )
    }
}
ReactDom.render(<StudentsList />,document.querySelector("#app"));