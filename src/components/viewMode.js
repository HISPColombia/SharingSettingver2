import React from 'react';
import None from 'material-ui/svg-icons/av/not-interested';
import ActionDone from 'material-ui/svg-icons/action/done';
import ActionDoneAll from 'material-ui/svg-icons/action/done-all';
import LinearProgress from 'material-ui/LinearProgress';
import Divider from 'material-ui/Divider';
import Filter from './Filter'
import appTheme from '../theme';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

const styles = {
  header: {
    fontSize: 24,
    fontWeight: 300,
    color: appTheme.rawTheme.palette.textColor,
    padding: '24px 0 12px 16px',
  },
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400,
  },
  containterfooter: {
    display: 'grid',
    gridTemplateColumns: 'auto 100px 140px',
    gridTemplateRows: 'auto'
  },
  ItemFooter: {
    fontSize: 14,
    alignSelf: 'center',
    justifySelf: 'end'
  },
  tablerow: {
    wordWrap: 'break-word',
    whiteSpace: 'normal'
  },
  buttonGroup: {
    textAlign: 'center'
  },
  divConcentTable:{
    height: 600,
    overflow: 'auto'
  }

};
const showWaiting=false;

class ViewObjects extends React.Component {



  constructor(props) {
    super(props);
    this.state = { currentPage: 0, searchByName: "",filterString:""}
  }

  componentDidMount() {
    this.state = { currentPage: this.props.currentPage,searchByName:"",filterString:""};
  }

  waiting(showWaiting){
    return (
       <TableRow>
      <TableRowColumn style={styles.tablerow}><LinearProgress mode="indeterminate" /></TableRowColumn>
      </TableRow>
    )
  }
  //methods
  resolveAccessMessage(access, type) {
    const publicAccessStatus = {
      "rw": "CAN_EDIT",
      "r-": "CAN_VIEW",
      "--": "NO_ACCESS",
    }
    let metaDataAccess = access[0] + access[1];
    let DataAccess = access[2] + access[3];
    if (type == "data") {
      return publicAccessStatus[DataAccess];
    }
    else {
      return publicAccessStatus[metaDataAccess];
    }
  }
    //handler
  handlefilterTextChange(textSearch) {
    this.setState({ searchByName: textSearch });

  }
  getFilterSelected(filterValue){
    if(Object.keys(filterValue).length!=0)
      this.setState({filterString:JSON.stringify(filterValue)})
    else  
      this.setState({filterString:""})
  }
  renderResultInTable() {
    let keysCount = 0;
    //convert object to array
    let rowRaw = Object.values(this.props.listObject);
    //
    const d2 = this.props.d2;
    const funResolvMessage = this.resolveAccessMessage;
    return rowRaw.map((row) => {
      keysCount++;
      //handle last separator
      if (row.userGroupAccesses.length > 0)
        var lastUG = row.userGroupAccesses[row.userGroupAccesses.length - 1].id;
      else
        var lastUG = "";

      if (row.userAccesses.length > 0)
        var lastUS = row.userAccesses[row.userAccesses.length - 1].id;
      else
        var lastUS = "";
        //filter by name ir by filter selected
      if (((row.displayName.includes(this.state.searchByName) == true) && (this.state.filterString.includes(row.id)==true || this.state.filterString=="")))
        return (<TableRow key={keysCount}>
          <TableRowColumn style={styles.tablerow}>{row.displayName}</TableRowColumn>
          <TableRowColumn style={styles.tablerow}>{funResolvMessage(row.publicAccess, "metadata") == "CAN_EDIT" ? <ActionDoneAll /> : funResolvMessage(row.publicAccess, "metadata") == "CAN_VIEW" ? <ActionDone /> : <None />}</TableRowColumn>
          <TableRowColumn style={styles.tablerow}>{row.externalAccess ? <ActionDone /> : <None />}</TableRowColumn>
          <TableRowColumn style={styles.tablerow}>

            {row.userGroupAccesses.map((ug) => {
              return (
                <div key={ug.id + "_" + keysCount} style={styles.buttonGroup} title={"METADATA: " + d2.i18n.getTranslation(funResolvMessage(ug.access, "metadata")) + " DATA:" + d2.i18n.getTranslation(funResolvMessage(ug.access, "data"))}>
                  <div>
                    {ug.access[1] == "w" ? <ActionDoneAll /> : <ActionDone />}
                    {ug.access[3] == "w" ? <ActionDoneAll /> : ug.access[2] == "r" ? <ActionDone /> : <None />}
                  </div>
                  <div>{ug.displayName}</div>
                  {lastUG != ug.id ? <Divider /> : ""}
                </div>)
            })
            }
          </TableRowColumn>
          <TableRowColumn style={styles.tablerow}>
            {row.userAccesses.map((us) => {
              return (
                <div key={us.id + "_" + keysCount} style={styles.buttonGroup} title={"METADATA: " + d2.i18n.getTranslation(funResolvMessage(us.access, "metadata")) + " DATA:" + d2.i18n.getTranslation(funResolvMessage(us.access, "data"))}>
                  <div>
                    {us.access[1] == "w" ? <ActionDoneAll /> : <ActionDone />}
                    {us.access[3] == "w" ? <ActionDoneAll /> : us.access[2] == "r" ? <ActionDone /> : <None />}
                  </div>
                  <div>{us.displayName}</div>
                  {lastUS != us.id ? <Divider /> : ""}
                </div>)

            })
            }
          </TableRowColumn>
        </TableRow>)
      })


  }
  render() {
    const d2 = this.props.d2;
    return (
      <div>
        <Filter 
        d2={d2} 
        handlefilterTextChange={this.handlefilterTextChange.bind(this)} 
        handleReturnFilterSelected={this.getFilterSelected.bind(this)}
        filterAvailable={this.props.resource}
        />
        <div style={styles.divConcentTable}>
        
        <Table>
          <TableHeader displaySelectAll={false} adjustForCheckbox={this.props.Enabledchecked}>
            <TableRow>
              <TableHeaderColumn>{d2.i18n.getTranslation("TABLE_NAME")}</TableHeaderColumn>
              <TableHeaderColumn>{d2.i18n.getTranslation("TABLE_PUBLICACCESS")}</TableHeaderColumn>
              <TableHeaderColumn>{d2.i18n.getTranslation("TABLE_EXTERNALACCESS")}</TableHeaderColumn>
              <TableHeaderColumn style={styles.buttonGroup}>{d2.i18n.getTranslation("TABLE_SHARINGGROUP")}</TableHeaderColumn>
              <TableHeaderColumn style={styles.buttonGroup}>{d2.i18n.getTranslation("TABLE_SHARINGUSER")}</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={this.props.Enabledchecked} showRowHover={true}>
            {Object.keys(this.props.listObject).length > 0 ? this.renderResultInTable() :this.waiting(false)}
          </TableBody>

        </Table>
        </div>
      </div>
    )

  }

};
ViewObjects.propTypes = {
  d2: React.PropTypes.object.isRequired,
  listObject: React.PropTypes.object,
  pager: React.PropTypes.object,
  Enabledchecked: React.PropTypes.bool,
  updateParams: React.PropTypes.func,
  currentPage: React.PropTypes.number,
  resource: React.PropTypes.object
};
export default ViewObjects;