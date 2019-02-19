import React from 'react';

//Material UI
import SearchTextBox from './SearchTextBox';
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

//Component

const styles = {
  paper: {
    height: 260,
    overflow: 'auto',
    width: '90%',
    margin: 20,
    textAlign: 'center',
    display: 'inline-block',
  },
  columnForEditButton: {
    width: '25%'
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
        userAccesses: [
          {
            access: "r-------",
            displayName: "Marko David Garcia 1",
            id: "hKNKkzXw92v",
            name: "Marko David Garcia"
          },
          {
            access: "r-------",
            displayName: "Helder Castrillon 1",
            id: "MZNoYkLK5iN",
            name: "Helder Castrillon",
          },
          {
            access: "r-------",
            displayName: "Marko David Garcia 2",
            id: "hKNKkzXw92v",
            name: "Marko David Garcia"
          },
          {
            access: "r-------",
            displayName: "Helder Castrillon 2",
            id: "MZNoYkLK5iN",
            name: "Helder Castrillon",
          },
          {
            access: "r-------",
            displayName: "Marko David Garcia 3",
            id: "hKNKkzXw92v",
            name: "Marko David Garcia"
          },
          {
            access: "r-------",
            displayName: "Helder Castrillon 3",
            id: "MZNoYkLK5iN",
            name: "Helder Castrillon",
          }
        ],
        userGroupAccesses: [{
          access: "rwrw----",
          displayName: "Administradores",
          id: "ru4VJJxdozy",
          name: "Administradores"
        },
        {
          access: "r-rw----",
          displayName: "Digitadores Mitú",
          id: "z95T3H2sy2e",
          name: "Digitadores Mitú"
        }

        ]
      }
    };
  }
  //API Query

  //query resource Selected
  async getResourceSelected(urlAPI) {
    const d2 = this.props.d2;
    const api = d2.Api.getApi();
    let result = {};
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
      return  getResourceSelected("29/sharing/search?key="+valuetoSearch)
  }

  render() {
    const d2 = this.props.d2;
    return (
      <div >
        <div style={styles.paper}>
          <Table>

            <TableHeader displaySelectAll={false} adjustForCheckbox={this.props.Enabledchecked}>
              <TableRow>

                <TableHeaderColumn columnNumber={2}>{d2.i18n.getTranslation("TABLE_USER_NAME")}</TableHeaderColumn>
                <TableHeaderColumn style={styles.columnForEditButton}>{d2.i18n.getTranslation("TABLE_METADATA_ACCESS")}</TableHeaderColumn>
                <TableHeaderColumn style={styles.columnForEditButton}> {d2.i18n.getTranslation("TABLE_DATA_ACCESS")}</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false} showRowHover={true}>
              {
                this.state.sharingOption.userAccesses.map(function (option) {
                  return (
                    <TableRow>
                      <TableRowColumn style={styles.columnIcon}><User color={styles.iconColor} /></TableRowColumn>
                      <TableRowColumn><span style={{ textColor: styles.iconColor }}>{option.displayName}</span></TableRowColumn>
                      <TableRowColumn style={styles.columnForEditButton}> <SpecialButton color={styles.iconColor} /> </TableRowColumn>
                      <TableRowColumn style={styles.columnForEditButton}>
                        <SpecialButton color={styles.iconColor} />
                      </TableRowColumn>
                    </TableRow>
                  )
                })}
 
               {
                this.state.sharingOption.userGroupAccesses.map(function (option) {
                  return (
                    <TableRow>
                      <TableRowColumn style={styles.columnIcon}><Group color={styles.iconColor} /></TableRowColumn>
                      <TableRowColumn><span style={{ textColor: styles.iconColor }}>{option.displayName}</span></TableRowColumn>
                      <TableRowColumn style={styles.columnForEditButton}> <SpecialButton color={styles.iconColor} /> </TableRowColumn>
                      <TableRowColumn style={styles.columnForEditButton}>
                        <SpecialButton color={styles.iconColor} />
                      </TableRowColumn>
                    </TableRow>
                  )
                })}
            </TableBody>
          </Table>
          </div>
        <SearchTextBox source={()=>this.searchUserGroups} />
      </div>
    );
  }
}

ListGroups.propTypes = {
  d2: React.PropTypes.object.isRequired,
};


export default ListGroups