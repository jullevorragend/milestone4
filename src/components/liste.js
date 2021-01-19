import { Button, Card, Table, Row, Col } from "antd";
import { observer } from "mobx-react-lite";
import { MainStore } from "./mainstore";

export const Liste = observer(() => {
	const Store = MainStore;
	return (
		<Card title="Liste der Impfwilligen" style={{ width: "100%" }}>
			<Row justify="space-between">
				<Col>Ausgewähle User: </Col>
				<Col>
					{Store.currentCompareData && Store.currentCompareData[0]
						? Store.currentCompareData[0].name
						: "keiner"}
					,{" "}
				</Col>
				<Col>
					{Store.currentCompareData && Store.currentCompareData[1]
						? Store.currentCompareData[1].name
						: "keiner"}
				</Col>
				<Col>
					<Button onClick={() => (Store.currentPage = "compare")}>
						Vergleichen
					</Button>
				</Col>
			</Row>
			<Table
				dataSource={Store.userDataSet}
				columns={[
					{
						title: "Name",
						dataIndex: "name",
					},
					{
						title: "Categorisierung",
						dataIndex: "categorization",
					},
					{
						title: "Vergleichen",
						render: (value, record, index) => {
							return (
								<Button
									onClick={() => {
										Store.currentCompareData.push(record);
										if (
											Store.currentCompareData.length > 2
										) {
											Store.currentCompareData.shift();
										}
									}}
								>
									+
								</Button>
							);
						},
					},
					{
						title: "Löschen",
						render: (value, record, index) => {
							return (
								<Button
									onClick={() => {
										Store.userDataSet.splice(index, 1);
										Store.update();
									}}
								>
									Löschen
								</Button>
							);
						},
					},
				]}
			></Table>
		</Card>
	);
});
