import { makeStyles } from '@mui/styles';

export default makeStyles((theme) => ({
      root: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: 20
      },
      textField: {
        margin: 10
      },
      leftSection: {
        backgroundColor: theme.palette.grey[50],
        padding: theme.spacing(2.5),
        display: 'flex',
        justifyContent: 'center', 
        flexDirection: "column",
        alignItems: 'center',
        borderRadius:20
      },
      dSection: {
        display: 'flex',
        justifyContent: 'center', 
        flexDirection: "row",
        alignItems: 'center',
        paddingLeft: 60,
        paddingBottom: 10
      },
      bSection: {
        padding: theme.spacing(1),
        justifyContent: 'left', 
        flexDirection: "column",
        alignItems: 'left'
      },
      Delve:{
        padding: theme.spacing(1),
        display: 'flex',
        justifyContent: 'center', 
        flexDirection: "row",
        alignItems: 'center'

      },
      rightSection: {
        backgroundColor: theme.palette.grey[800],
        padding: theme.spacing(2),
        borderRadius:20,
        color: "#FFFFFF"
      },
      scroll :{
        height: 500,
        overflowX: 'hidden',
        overflowY: 'auto',
        padding: 20,
      },
  
}));