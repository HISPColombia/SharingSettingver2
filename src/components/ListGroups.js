import React from 'react';

//Material UI

import appTheme from '../theme';
import SpecialButton from './SpecialButton';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import User from 'material-ui/svg-icons/social/person';
import Group from 'material-ui/svg-icons/social/group';
import Clear from 'material-ui/svg-icons/content/clear'; 
import FlatButton from 'material-ui/FlatButton';
//Component
import SearchTextBox from './SearchTextBox';
//
const styles = {
  paper: {
    height: 200,
    overflow: 'auto',
    width: '90%',
    margin: 20,
    textAlign: 'center',
    display: 'inline-block',
  },
  textBox:{
    width: '90%',
    background:appTheme.rawTheme.palette.canvasColor,
    margin: 20,
    position: "relative"
  },
  columnForEditButton: {
    width: '15%'
  },
  columnForMain: {
    width: '40%'
  },
  columnIcon: {
    width: 10
  },
  iconColor: appTheme.settingOptions.icon
}



class ListGroups extends React.Component {


  constructor(props) {
    super(props);
    this.state = {
      sharingOption: {
        userAccesses: [],
        userGroupAccesses: []        
      },
      idSelectedforFilter:[]
    };
  }

  
  //API Query

  //query resource Selected
  async getResourceSelected(urlAPI) {
    const d2 = this.props.d2;
    const api = d2.Api.getApi();
    let result = {};
    console.log(urlAPI);
    try {
      let res = await api.get(urlAPI);
      return res;      
    }
    catch (e) {
      console.error('Could not access to API Resource');
    }
    return result;
  }
  async searchUserGroups(valuetoSearch){
     return this.getResourceSelected("sharing/search?key="+valuetoSearch).then(res => {
       let users=[];
       let groups=[];
       res.users.forEach((user)=>{
         //filter that this object was been previously selected
         if(!this.state.idSelectedforFilter.includes(user.id))
              users.push({
                  id:user.id,
                  displayName:user.displayName,
                  data:{type:'user'}
                })
       })
      res.userGroups.forEach((group)=>{
        //filter that this object was been previously selected
        if(!this.state.idSelectedforFilter.includes(group.id))
            groups.push({
              id:group.id,
              displayName:group.displayName,
              data:{type:'group'}
            })
     })
      return users.concat(groups);
     })
  }
  //handle
  //change access each click
  HandleClickButton(data){
    let access={0:"--",1:"r-",2:"rw"}
    let {userAccesses,userGroupAccesses}=this.state.sharingOption;
    switch(data.type){
      case "USERMETADATA":
        userAccesses=this.state.sharingOption.userAccesses.map((user)=>{
          if(user.id==data.id){
              user.access=access[data.value]+user.access.substring(2, 4)+"----";
          }
          return user
        })
      break;
      case "GROUPMETADATA":
        userGroupAccesses=this.state.sharingOption.userGroupAccesses.map((group)=>{
          if(group.id==data.id){
            group.access=access[data.value]+group.access.substring(2, 4)+"----";
          }
          return group
        })
      break;
      case "USERDATA":
        userAccesses=this.state.sharingOption.userAccesses.map((user)=>{
          if(user.id==data.id){
            user.access=user.access.substring(0, 2)+access[data.value]+"----";
          }
          return user
        })
      break;
      case "GROUPDATA":
      userGroupAccesses=this.state.sharingOption.userGroupAccesses.map((group)=>{
        if(group.id==data.id){
          group.access=group.access.substring(0, 2)+access[data.value]+"----";         
        }
        return group
      })
      break;
    }
    this.setState({sharingOption:{userAccesses,userGroupAccesses}})
  }
  handleRemoveItem(id){
    this.setState({
      sharingOption:{userAccesses:this.state.sharingOption.userAccesses.filter((user)=>{
        if(user.id!=id)
          return (user);
      }),userGroupAccesses:this.state.sharingOption.userGroupAccesses.filter((group)=>{
        if(group.id!=id)
          return (group);
      })}
    })

      //remove filter
      let {idSelectedforFilter}=this.state;
      var i = idSelectedforFilter.indexOf( id );
      if ( i !== -1 ) {
        idSelectedforFilter.splice( i, 1 );
        this.setState({
          idSelectedforFilter
        });
      }
  }

  SelectUserOrGroup(valueSelected){
    let {idSelectedforFilter}=this.state;
    idSelectedforFilter.push(valueSelected.id)
    this.setState({
      idSelectedforFilter
    });
    if(valueSelected.data.type=='user')
      this.state.sharingOption.userAccesses.push(
        {
          access: "--------",
          displayName: valueSelected.displayName,
          id: valueSelected.id,
          name: valueSelected.displayName
        }
      )
    else
      this.state.sharingOption.userGroupAccesses.push(
        {
          access: "--------",
          displayName: valueSelected.displayName,
          id: valueSelected.id,
          name: valueSelected.displayName
        }
      )
      this.setState({sharingOption:this.state.sharingOption})
  }
  componentDidUpdate(prevProp,prevState){
    if(prevState.sharingOption!=this.state.sharingOption)
      this.props.GroupSelected(this.state.sharingOption);
  }

  componentDidMount(){
    this.setState({sharingOption:this.props.currentSelected});
    //previus Selected
    let {idSelectedforFilter}=this.state;
    this.props.currentSelected.userAccesses.forEach((obj)=>{     
      idSelectedforFilter.push(obj.id)     
    })
    this.props.currentSelected.userGroupAccesses.forEach((obj)=>{     
      idSelectedforFilter.push(obj.id)     
    })
    //update state
    this.setState({
      idSelectedforFilter
    });
  }
  render() {
    const d2 = this.props.d2;
    var keyCount=0;
    return (
      <div style={{position: 'relative'}} >
        <div style={styles.paper}>
          <Table>

            <TableHeader displaySelectAll={false} adjustForCheckbox={this.props.Enabledchecked}>
              <TableRow>

                <TableHeaderColumn columnNumber={2} style={styles.columnForMain} >{d2.i18n.getTranslation("TABLE_USER_NAME")}</TableHeaderColumn>
                <TableHeaderColumn style={styles.columnForEditButton}>{d2.i18n.getTranslation("TABLE_METADATA_ACCESS")}</TableHeaderColumn>
                <TableHeaderColumn style={styles.columnForEditButton}> {d2.i18n.getTranslation("TABLE_DATA_ACCESS")}</TableHeaderColumn>
                <TableHeaderColumn style={styles.columnForEditButton}></TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false} showRowHover={true}>
              {
                this.state.sharingOption.userAccesses.map((option)=> {
                  keyCount++;
                  let access={"--":0,"r-":1,"rw":2}
                  let AccessMetadata=access[option.access.substring(0,2)];
                  let AccessData=access[option.access.substring(2,4)];
                 
                  return (
                    <TableRow key={option.id+"_"+keyCount}>
                      <TableRowColumn style={styles.columnIcon}><User color={styles.iconColor} /></TableRowColumn>
                      <TableRowColumn><span style={{ textColor: styles.iconColor }}>{option.displayName}</span></TableRowColumn>
                      <TableRowColumn style={styles.columnForEditButton}> <SpecialButton id={option.id} color={styles.iconColor} callBackHandleClick={this.HandleClickButton.bind(this)} type={"USERMETADATA"} enabled={true} defaultValue={AccessMetadata} /> </TableRowColumn>
                      <TableRowColumn style={styles.columnForEditButton}>
                      <SpecialButton id={option.id} color={styles.iconColor} callBackHandleClick={this.HandleClickButton.bind(this)} type={"USERDATA"} enabled={this.props.resource.sharingData} defaultValue={AccessData} title={d2.i18n.getTranslation("MESSAGE_DISABLED_DATABUTTON")} />
                      </TableRowColumn>
                      <TableRowColumn style={styles.columnForEditButton}>
                      <FlatButton
                        onClick={()=>this.handleRemoveItem(option.id)} 
                        icon={<Clear color={styles.iconColor} />}
                        />
                      </TableRowColumn>
                    </TableRow>
                  )
                })}
 
               {
                this.state.sharingOption.userGroupAccesses.map((option)=> {
                  let access={"--":0,"r-":1,"rw":2}
                  let AccessMetadata=access[option.access.substring(0,2)];
                  let AccessData=access[option.access.substring(2,4)];
                  return (
                    <TableRow key={option.id+"_"+keyCount}>
                      <TableRowColumn style={styles.columnIcon}><Group color={styles.iconColor} /></TableRowColumn>
                      <TableRowColumn><span style={{ textColor: styles.iconColor }}>{option.displayName}</span></TableRowColumn>
                      <TableRowColumn style={styles.columnForEditButton}> <SpecialButton id={option.id} color={styles.iconColor} callBackHandleClick={this.HandleClickButton.bind(this)} type={"GROUPMETADATA"} enabled={true} defaultValue={AccessMetadata} /> </TableRowColumn>
                      <TableRowColumn style={styles.columnForEditButton}>
                      <SpecialButton id={option.id} color={styles.iconColor} callBackHandleClick={this.HandleClickButton.bind(this)} type={"GROUPDATA"} enabled={this.props.resource.sharingData} defaultValue={AccessData} title={d2.i18n.getTranslation("MESSAGE_DISABLED_DATABUTTON")} />
                      </TableRowColumn>
                      <TableRowColumn style={styles.columnForEditButton}>
                      <FlatButton
                        onClick={()=>this.handleRemoveItem(option.id)} 
                        icon={<Clear color={styles.iconColor} />}
                        />
                      </TableRowColumn>
                    </TableRow>
                  )
                })}
            </TableBody>
          </Table>
          </div>
          <div style={styles.textBox}>
        <SearchTextBox 
        source={this.searchUserGroups.bind(this)} 
        title={d2.i18n.getTranslation("TITLE_SEARCH_GROUP")} 
        callBackSelected={this.SelectUserOrGroup.bind(this)} 
        color={styles.iconColor}
        showValueSelected={false}  
        disabled={false}        
        />
        </div>
      </div>
    );
  }
}

ListGroups.propTypes = {
  d2: React.PropTypes.object.isRequired,
  GroupSelected:React.PropTypes.func,
  resource:React.PropTypes.object,
  currentSelected:React.PropTypes.object
};


export default ListGroups