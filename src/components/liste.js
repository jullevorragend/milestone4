import { Card, Table } from "antd";
import { List } from "antd/lib/form/Form";
import { observer } from "mobx-react-lite";
import { MainStore } from "./mainstore";

export const Liste = observer(() => {
	const Store = MainStore;
	return (
		<Card title="Liste der Impfwilligen">
			<Table
				dataSource={Store.userDataSet}
				columns={[
					{
						title: "Name",
						dataIndex: "name",
					},
					{
						title: "Expositionsrisiko",
						dataIndex: ["fragebogen", "expositionsrisiko"],
					},
				]}
			></Table>
		</Card>
	);
});
