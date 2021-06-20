import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import CastActionDropDown from './CastActionDropDown';
import Checkbox from '@material-ui/core/Checkbox';
import { useSelector } from 'react-redux';
import { RootStore } from '@src/store';

const useStyles = makeStyles({
  root: {
    width: '100%',
    overflowX: 'auto',
	flex: 1,
	borderRadius: '0'
  },
  table: {
    minWidth: 650,
  },
  spanText:{
	fontSize: '10px',
	  '& hover':{
		color: 'rgba(0,0,255,0.2)'
	  }
  },
  headRow:{
	backgroundColor: 'rgba(0,0,0,0.1)',
  },
  headCell:{
    borderRight: '1px dotted #000'
  },
  variantCell:{
	  width: 180
  },
  idCell:{
	width: 60
  },
  sceneCell:{
	width: 60
  },

});


interface ExpandableTableRowProps {
	[otherProps: string]: any;
	ID: any;
	selected?: any;
	scencs: any;
	name: string;
	Character_id: number;
}

// eslint-disable-next-line react/prop-types
const ExpandableTableRow: React.FC<ExpandableTableRowProps> = (props: ExpandableTableRowProps) => {
	const [isExpanded, setIsExpanded] = React.useState(false);
	const classes = useStyles();
	const {name, otherProps ,ID, scencs , Character_id} = props;

	const [checked, setChecked] = React.useState(false);
	const [hide, setHide] = React.useState(true);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
	  setChecked(event.target.checked);
	};

	return (
	  <>
		<TableRow {...otherProps} onMouseEnter={()=>setHide(false)} onMouseLeave={()=>setHide(true)}>
		<TableCell align="left">
			<Checkbox
				checked={checked}
				onChange={handleChange}
				inputProps={{ 'aria-label': 'primary checkbox' }}
      	/></TableCell>
		<TableCell className={classes.idCell} align="left">{ID}</TableCell>
		<TableCell  component="th" scope="row">
                {name}
        </TableCell>
		<TableCell className={classes.sceneCell} align="center">{scencs}</TableCell>
		  <TableCell className={classes.variantCell}>
		  {!hide && (
		  <IconButton  onClick={() => setIsExpanded(!isExpanded)}>
		  {isExpanded ? <><KeyboardArrowUpIcon /> <span className={classes.spanText}>(Hide Varirants)</span></> : <><KeyboardArrowDownIcon /><span className={classes.spanText}>(Show Varirants)</span></>}
		</IconButton>
		)}

		  </TableCell>
        <TableCell align="left">
			<CastActionDropDown 
				ID={ID} 
				Character_name={name} 
				Character_id={Character_id}
			/>
			</TableCell>
		</TableRow>
		{isExpanded && (
		  <TableRow>
			<TableCell padding="checkbox" />
			<TableCell colSpan={5}> {name} ({scencs} scenes)</TableCell>
		  </TableRow>
		)}
	  </>
	);
  };

const CastDataTable: React.FC  = () => {
	const classes = useStyles();
	const characterState = useSelector((state: RootStore) => state.characters)
	const CharacterList = [...characterState]

  return (
    <Paper className={classes.root}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead className={classes.headRow}>
          <TableRow>
            <TableCell padding="checkbox" />
            <TableCell align="right">ID</TableCell>
            <TableCell align="right">Name</TableCell>
			<TableCell align="right">Scenes</TableCell>
            <TableCell  />
			<TableCell padding="checkbox" />
          </TableRow>
        </TableHead>
        <TableBody>
          {CharacterList.sort((a, b) => a.id - b.id )
		  	.map((character, index) => (
            <ExpandableTableRow
              key={character.character_name}
			  name={character.character_name}
			  ID={character.associated_num}
			  scencs={character.character_count}
			  Character_id = {character.id}
            />
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
export default CastDataTable;
