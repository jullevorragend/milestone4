import { makeStyles } from "@material-ui/core/styles";
import {
	Button,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from "@material-ui/core";
import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { MainStore } from "./mainstore";

const useStyles = makeStyles({
	root: {
		background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
		border: 0,
		borderRadius: 3,
		boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
		color: "white",
		height: 48,
		padding: "0 30px",
	},
	table: {
		backgroundColor: "rgba(200,200,210,1)",
	},
});
export const Main = observer(() => {
	const classes = useStyles();
	const Store = MainStore;
	useEffect(() => {
		Store.init();
	}, []);

	return (
		<div>
			<TableContainer component={Paper}>
				<Table className={classes.table} aria-label="simple table">
					<TableHead>
						<TableRow>
							<TableCell>Name</TableCell>
							<TableCell>Alter</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{Store.userDataSet.map((user) => (
							<TableRow key={user.userId}>
								<TableCell component="th" scope="row">
									{user.name}
								</TableCell>
								<TableCell>{user.dateOfBirth}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
			<Button onClick={() => Store.sortUsersByPriority()}>
				Sortieren
			</Button>
		</div>
	);
});
